import datetime
import json
import logging
import os
import requests

from urllib.parse import urlencode

from fastapi import FastAPI, Request, Query, BackgroundTasks, Depends
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import Flow

from constants import QUERY_APPLIED_EMAIL_FILTER, SCOPES, CLIENT_SECRETS_FILE, REDIRECT_URI, COOKIE_SECRET
from auth_utils import AuthenticatedUser, get_user
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
from session.session_layer import create_random_session_string, validate_session, is_token_expired

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=COOKIE_SECRET)

# Set up Jinja2 templates
templates = Jinja2Templates(directory="templates")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s - %(message)s')

api_call_finished = False


@app.get("/")
async def root():
    return {"message": "Hello from Jobba the Huntt!"}


@app.get("/processing", response_class=HTMLResponse)
async def processing(request: Request, user_id: str = Depends(validate_session)):
    logging.info("user_id: %s processing", user_id)
    global api_call_finished
    if not user_id:
        logger.info("user_id: not found, redirecting to login")
        return RedirectResponse("/logout", status_code=303)
    if api_call_finished:
        logger.info("user_id: %s processing complete", user_id)
        return templates.TemplateResponse("success.html")
    else:
        logger.info("user_id: %s processing not complete for file", user_id)
        # Show a message that the job is still processing
        return templates.TemplateResponse("processing.html")


@app.get("/download-file")
async def download_file(request: Request, user_id: str = Depends(validate_session)):
    if not user_id:
        return RedirectResponse("/logout", status_code=303)
    directory = get_user_filepath(user_id)
    filename = "emails.csv"
    filepath = f"{directory}/{filename}"
    if os.path.exists(filepath):
        logger.info("user_id:%s downloading from filepath %s", user_id, filepath)
        return FileResponse(filepath)
    return HTMLResponse(content="File not found :( ", status_code=404)

@app.get("/logout")
async def logout(request: Request, response: RedirectResponse):
    logger.info("Logging out")
    request.session.clear()
    response.delete_cookie(key="Authorization")
    return RedirectResponse("/login", status_code=303)


def fetch_emails(user: AuthenticatedUser) -> None:
    global api_call_finished
    logger.info("user_id:%s fetch_emails", user.user_id)
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
@app.get("/login")
def login(request: Request, background_tasks: BackgroundTasks, response: RedirectResponse):
    """Handles the redirect from Google after the user grants consent."""
    code = request.query_params.get("code")
    try:
        if not code:
            flow = Flow.from_client_secrets_file(
            CLIENT_SECRETS_FILE, SCOPES, redirect_uri=REDIRECT_URI)
            logger.info("No code in request, redirecting to authorization URL")
            # If no code, redirect the user to the authorization URL
            authorization_url, state = flow.authorization_url(prompt="consent")
            logger.info("Redirecting to %s", authorization_url)
            response = RedirectResponse(url=authorization_url)
            
            logger.info("Response location: %s", response.headers["location"])
            logger.info("Status Code: %s", response.status_code)
            logger.info("Headers: %s", response.headers)
            return response

        # Exchange the authorization code for credentials
        logger.info("code found, starting fetch_token...")
        flow.fetch_token(code=code)
        creds = flow.credentials
        user = AuthenticatedUser(creds)
        # Create a session for the user
        session_id = request.session["session_id"] = create_random_session_string()
        request.session["token_expiry"] = datetime.datetime.strptime(str(creds.expiry).rstrip("Z").split(".")[0], "%Y-%m-%d %H:%M:%S").isoformat()  # Token expiry logic
        request.session["user_id"] = user.user_id
        response.set_cookie(key="Authorization", value=session_id, secure=True, httponly=True)

        background_tasks.add_task(fetch_emails, user)
        logger.info("user_id:%s background_tasks.add_task fetch_emails", user.user_id)

        return RedirectResponse(url="/processing", status_code=303)
    except Exception as e:
        logger.error("login: an error occurred: %s", e)
        return HTMLResponse(content="An error occurred, sorry!", status_code=500)


@app.get("/success", response_class=HTMLResponse)
def success(request: Request, user_id: str = Depends(validate_session)):
    if not user_id:
        return RedirectResponse("/logout", status_code=303)

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
