import os
import json
import logging
import datetime
from urllib.parse import urlencode
from fastapi import FastAPI, Request, Query, BackgroundTasks
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import Flow
from constants import QUERY_APPLIED_EMAIL_FILTER
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
from auth_utils import AuthenticatedUser, get_user

app = FastAPI()
# Set up Jinja2 templates
templates = Jinja2Templates(directory="templates")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s - %(message)s')

api_call_finished = False

@app.get("/")
async def root():
    return {"message": "Hello from Jobba the Huntt!"}

@app.get("/processing")
async def processing(request: Request):
    global api_call_finished
    if api_call_finished:
        logger.info("Processing complete for file")
        # Automatically redirect to the success page after processing is done
        return RedirectResponse("/success")
    else:
        logger.info("Processing not complete for file")
        # Show a message that the job is still processing
        return templates.TemplateResponse("processing.html", {"request": request})

@app.get("/download-file")
async def download_file(user_id: str):
    # TODO: get authenticated user object from user_id
    logger.info("Downloading from file_path")
    file_path = AuthenticatedUser(user_id).filepath # TODO: use creds isntead of user_id
    # Return the file for download
    return FileResponse(file_path)

def fetch_emails(user: AuthenticatedUser) -> None:
    global api_call_finished
    logger.info("user_id:%s fetch_emails", user.user_id)
    service = build("gmail", "v1", credentials=user.creds)
    results = get_email_ids(
        query=QUERY_APPLIED_EMAIL_FILTER, gmail_instance=service
    )
    messages = results.get("messages", [])

    # Directory to save the emails
    output_dir, main_filename = user.filepath.split("/")
    os.makedirs(output_dir, exist_ok=True)
    main_filepath = os.path.join(output_dir, main_filename)

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
        export_to_csv(main_filepath, message_data)
    api_call_finished = True 
    return

# Define the route for downloading CSV
@app.get("/get-jobs")
def get_jobs(request: Request, background_tasks: BackgroundTasks):
    """Handles the redirect from Google after the user grants consent."""
    logger.info("Request to get_jobs: %s", request)
    code = request.query_params.get("code")
    google_scopes = os.getenv("GOOGLE_SCOPES")
    logger.debug("Code: %s", code)
    logger.debug("env variables sc: %s", os.getenv("GOOGLE_SCOPES"))
    logger.debug("env variable red: %s", os.getenv("REDIRECT_URI"))
    logger.debug("env variable scope with .get: %s", os.environ.get("GOOGLE_SCOPES"))
    try:
        SCOPES = json.loads(google_scopes)
        logger.debug("SCOPES: %s", SCOPES)
    except json.JSONDecodeError as e:
        logger.error("Error decoding JSON: %s", e)
        logger.error("repr(google_scopes)): %s", repr(google_scopes))
    CLIENT_SECRETS_FILE = "credentials.json"
    REDIRECT_URI = os.getenv("REDIRECT_URI")

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
    logger.debug("Credentials fetched: %s", creds)
    user = AuthenticatedUser(creds)
    logger.debug("User: %s", user)
    logger.debug("User ID: %s", user.user_id)
    logger.debug("User Filepath: %s", user.filepath)
    # Save the credentials for the next run in user's directory
    os.makedirs(user.filepath, exist_ok=True)
    with open(f"{user.filepath}/token.json", "w", encoding="utf-8") as token:
        token.write(creds.to_json())

    try:
        background_tasks.add_task(fetch_emails, user)
        # Redirect to a temporary page indicating job processing
        return RedirectResponse(url="/processing")
    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        logger.error("An error occurred: %s" % error)
        return HTMLResponse(content=f"An error occurred: {error}", status_code=500)

@app.get("/success")
def success():
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
