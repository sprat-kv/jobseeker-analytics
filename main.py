import os.path
import logging
import datetime
from urllib.parse import quote
from fastapi import FastAPI, Request, Query
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import Flow
from constants import QUERY_APPLIED_EMAIL_FILTER
from db_utils import export_to_csv
from email_utils import (
    get_gmail_credentials,
    get_email_ids,
    get_email,
    get_company_name,
    get_received_at_timestamp,
    get_email_subject_line,
    get_email_domain_from_address,
    get_email_from_address,
)

app = FastAPI()
logger = logging.getLogger(__name__)
logging.basicConfig(filename='example.log', encoding='utf-8', level=logging.DEBUG)

@app.get("/")
async def root():
    return {"message": "Hello from Jobba the Huntt!"}

# Define the route for downloading CSV
@app.get("/get-jobs")
async def get_jobs(request: Request):
    """Handles the redirect from Google after the user grants consent."""
    logger.info(f"Request to get_jobs: {request}")
    code = request.query_params.get("code")
    if not code:
        # If no code, redirect the user to the authorization URL
        authorization_url = get_gmail_credentials()
        logger.info(f"Redirecting to {authorization_url}")
        response = RedirectResponse(url=authorization_url)
        
        logger.info(f"Response location: {response.headers['Location']}")
        logger.info(f"Status Code: {response.status_code}")
        logger.info(f"Headers: {response.headers}")
        return response

    # If modifying these scopes, delete the file token.json.
    SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
    CLIENT_SECRETS_FILE = "credentials.json"

    # Exchange the authorization code for credentials
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, SCOPES, redirect_uri="https://jobseeker-analytics.onrender.com/get-jobs"
    )
    flow.fetch_token(authorization_response=str(request.url))
    
    creds = flow.credentials

    # Save the credentials for the next run
    with open('token.json', 'w') as token_file:
        token_file.write(creds.to_json())
    try:
        # Call the Gmail API
        service = build("gmail", "v1", credentials=creds)
        results = get_email_ids(
            query=QUERY_APPLIED_EMAIL_FILTER, gmail_instance=service
        )
        messages = results.get("messages", [])

        # Directory to save the emails
        output_dir = "data"
        os.makedirs(output_dir, exist_ok=True)

        emails_data = []
        main_filename = "emails.csv"
        main_filepath = os.path.join(output_dir, main_filename)

        for message in messages:
            message_data = {}
            # (email_subject, email_from, email_domain, company_name, email_dt)
            msg_id = message["id"]
            msg = get_email(id=msg_id, gmail_instance=service)
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
        # Export CSV
            jobs_export_filepath = export_to_csv(main_filepath, message_data)
        # Redirect to a download page
            return RedirectResponse(url=f"/success?file={jobs_export_filepath}")

    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f"An error occurred: {error}")

@app.get("/success")
def success(request: Request):
    file_path = request.query_params.get("file")
    encoded_file_path = quote(file_path)
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
        <a href="/download-file?file_path={encoded_file_path}" download="jobbathehuntt_export_{today}.csv">
            <button>Download File</button>
        </a>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)

@app.get("/download-file")
def download_file(filepath: str = Query(...)):
    logger.info(f"Received file_path: {filepath}")
    # Return the file response
    return FileResponse(filepath)

# Run the app using Uvicorn
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
