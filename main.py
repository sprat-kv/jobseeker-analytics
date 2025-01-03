import datetime
import json
import logging
import os
import requests

from urllib.parse import urlencode

from fastapi import FastAPI, Request, Query, BackgroundTasks
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi_sessions import SessionCookie, SessionInfo
from fastapi_sessions.backends import InMemoryBackend

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import Flow

from constants import QUERY_APPLIED_EMAIL_FILTER, SCOPES, CLIENT_SECRETS_FILE, REDIRECT_URI, COOKIE_SECRET
from db_utils import export_to_csv
from email_utils import (
    get_email_ids,
    get_email,
    get_company_name,
    get_received_at_timestamp,
    get_email_subject_line,
    get_email_domain_from_address,
    get_email_from_address,
)
from auth_utils import AuthenticatedUser, get_user, validate_google_token

app = FastAPI()

# Set up Jinja2 templates
templates = Jinja2Templates(directory="templates")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s - %(message)s')

api_call_finished = False

# Define the session data
class SessionData(BaseModel):
    user_id: str  # Store only the Google `sub` (unique user ID)


# Configure session cookie
session_cookie = SessionCookie(
    name="session",
    secret_key=COOKIE_SECRET,
    backend=InMemoryBackend(),
    data_model=SessionData,
    scheme_name="Google Auth Session",
    auto_error=False,
)


@app.get("/")
async def root():
    return {"message": "Hello from Jobba the Huntt!"}


@app.get("/processing", response_class=HTMLResponse)
async def processing(session_info: Optional[SessionInfo] = Depends(session_cookie)):
    global api_call_finished
    if session_info is None:
        raise HTTPException(
            status_code=403,
            detail="Oops! Try logging in again to access this page.",
        )
    if api_call_finished:
        logger.info("user_id: %s processing complete", session_info[1].user_id)
        return templates.TemplateResponse("success.html")
    else:
        logger.info("Processing not complete for file")
        # Show a message that the job is still processing
        return templates.TemplateResponse("processing.html")


@app.post("/download-file")
async def download_file(session_info: Optional[SessionInfo] = Depends(session_cookie)):
    if session_info is None:
        raise HTTPException(
            status_code=403,
            detail="Oops! Try logging in again to download your file.",
        )
    directory = get_user_filepath(session_info[1].user_id)
    filename = "emails.csv"
    filepath = f"{directory}/{filename}"
    if os.path.exists(filepath):
        logger.info("user_id:%s downloading from filepath %s" % session_info[1].user_id, filepath)
        return FileResponse(filepath)
    return HTMLResponse(content="File not found :( ", status_code=404)


def fetch_emails(user: AuthenticatedUser, session_info: Optional[SessionInfo] = Depends(session_cookie)) -> None:
    global api_call_finished
    logger.info("user_id:%s fetch_emails", user.user_id)
    if session_info is None:
        raise HTTPException(
            status_code=403,
            detail="Oops! Try logging in again to refresh your email data.",
        )
    service = build("gmail", "v1", credentials=user.creds)
    results = get_email_ids(
        query=QUERY_APPLIED_EMAIL_FILTER, gmail_instance=service
    )
    messages = results.get("messages", [])

    # Directory to save the emails
    os.makedirs(user.filepath, exist_ok=True)

    emails_data = []
    for message in messages:
        message_data = {}
        # (email_subject, email_from, email_domain, company_name, email_dt)
        msg_id = message["id"]
        msg = get_email(message_id=msg_id, gmail_instance=service)
        # Constructing the object which will be written into db
        message_data["msg_id"] = [msg_id]
        message_data["threadId"] = [message["threadId"]]
        message_data["subject"] = [get_email_subject_line(msg)]
        message_data["from_name"] = [get_email_from_address(msg)]
        message_data["fromdomain_match"] = [
            get_email_domain_from_address(
                message_data["from_name"][0]
                if (
                    isinstance(message_data["from_name"], list)
                    and len(message_data["from_name"]) > 0
                )
                else message_data["from_name"]
            )
        ]
        message_data["top_word_company_proxy"] = [get_company_name(msg_id, msg)]
        message_data["received_at"] = [get_received_at_timestamp(msg_id, msg)]

        # Exporting the email data to a CSV file
        export_to_csv(user.filepath, user.user_id, message_data)
        api_call_finished = True    # TODO: remove after debugging. only processes 1 email now
        return
    api_call_finished = True

# Define the route for OAuth2 flow
@app.get("/get-jobs")
def get_jobs(request: Request, background_tasks: BackgroundTasks, session_info: Optional[SessionInfo] = Depends(session_cookie)):
    """Handles the redirect from Google after the user grants consent."""
    try:
        code = request.query_params.get("code")
        flow = Flow.from_client_secrets_file(
            CLIENT_SECRETS_FILE, SCOPES, redirect_uri=REDIRECT_URI
        )
        if not code:
            # If no code, redirect the user to the authorization URL
            authorization_url, state = flow.authorization_url(prompt="consent")
            logger.info("Redirecting to %s", authorization_url)
            response = RedirectResponse(url=authorization_url)
            
            logger.info("Response location: %s", response.headers["location"])
            logger.info("Status Code: %s", response.status_code)
            logger.info("Headers: %s", response.headers)
            return response

        # Exchange the authorization code for credentials
        flow.fetch_token(authorization_response=str(request.url))
        creds = flow.credentials
        user = AuthenticatedUser(creds)

        # Handle existing session
        old_session = None
        if session_info:
            old_session = session_info[0]
            logger.info("user_id:%s found old session", user.user_id)
        
        # Create a new session
        session_data = SessionData(user_id=user.user_id)
        await session_cookie.create_session(session_data, response, old_session)
        logger.info("user_id:%s create_session", user.user_id)

        background_tasks.add_task(fetch_emails, user)
        logger.info("user_id:%s background_tasks.add_task fetch_emails", user.user_id)

        return RedirectResponse(url="/processing", status_code=303)
    except Exception as e:
        logger.error("user_id:%s an error occurred: %s", user_id, e)
        return HTMLResponse(content="An error occurred, sorry!", status_code=500)


    today = str(datetime.date.today())

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Success</title>
    </head>
    <body>
        <h1>Success! Your file is ready.</h1>
        <p>Click the button below to download your file.</p>
        <a href="/download-file" download="jobbathehuntt_export_{today}.csv">
            <button>Download File</button>
        </a>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)


# Run the app using Uvicorn
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
