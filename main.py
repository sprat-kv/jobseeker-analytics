import os.path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
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

@app.get("/")
async def root():
    return {"message": "Hello from Jobba the Huntt!"}

# Define the route for downloading CSV
@app.get("/get-jobs")
async def get_jobs():
    creds = get_gmail_credentials()
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
            return FileResponse(export_to_csv(main_filepath, message_data))

    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f"An error occurred: {error}")


# Run the app using Uvicorn
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
