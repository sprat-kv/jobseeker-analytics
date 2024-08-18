import os.path
import base64

from google.auth.exceptions import RefreshError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

JOBS_LABEL_ID = "Label_7646018251861665561"
# ideally would be able to programmatically fetch job application-related emails but in interest of time,
# I manually filtered and placed in this label 'jobs' with this id starting with Label_


def main():
    """Shows basic usage of the Gmail API.
    Lists the user's Gmail labels.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except RefreshError:
                os.remove("token.json")
                creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        # Call the Gmail API
        service = build("gmail", "v1", credentials=creds)
        # results = service.users().labels().list(userId="me").execute()
        # labels = results.get("labels", [])
        query = (
            '(subject:"thank" AND from:"no-reply@ashbyhq.com") OR '
            '(subject:"thank" AND from:"careers@") OR '
            '(subject:"thank" AND from:"no-reply@greenhouse.io") OR '
            '(subject:"application was sent" AND from:"jobs-noreply@linkedin.com") OR '
            'from:"notification@smartrecruiters.com" OR '
            'subject:"received your application" OR '
            'subject:"your application was sent to" OR '
            'subject:"thank you for applying" OR '
            'subject:"thanks for applying to" OR '
            'subject:"confirmation of your application" OR '
            'subject:"your recent job application" OR '
            'subject:"successfully submitted" OR '
            'subject:"application received" OR '
            'subject:"application submitted" OR '
            'subject:"we received your application" OR '
            'subject:"thank you for your submission" OR '
            'subject:"thank you for your interest" OR '
            'subject:"thanks for your interest" OR '
            'subject:"thank you for your application" OR '
            'subject:"application has been submitted" OR '
            '(subject:"your application to" AND subject:"has been received") OR '
            '(subject:"your application for" AND -subject:"update") OR '
            'subject:"your job application has been received" OR '
            'subject:"thanks for your application" OR '
            '(subject:"we received your" AND subject:"application")'
        )  # label:jobs -label:query4
        results = (
            service.users()
            .messages()
            .list(userId="me", labelIds=[JOBS_LABEL_ID])
            .execute()
        )

        messages = results.get("messages", [])
        # print(results)
        if not results:
            print("No message found.")
            return

        # Directory to save the emails
        output_dir = "emails_v2"
        os.makedirs(output_dir, exist_ok=True)

        for message in messages:
            msg_id = message["id"]
            msg = service.users().messages().get(userId="me", id=msg_id).execute()
            email_data = msg["payload"]["headers"]
            import pdb

            pdb.set_trace()
            for values in email_data:
                name = values["name"]
                if name == "From":
                    from_name = values["value"]
                    print(from_name)
                    subject = [j["value"] for j in email_data if j["name"] == "Subject"]
                    print(subject)

            # I added the below script.
            for p in msg["payload"]["parts"]:
                if p["mimeType"] in ["text/plain", "text/html"]:
                    data = base64.urlsafe_b64decode(p["body"]["data"]).decode("utf-8")
                    print(data)
            # Extract the email data
            # email_data = msg.get(
            #     "payload"
            # )  # Simplified, can use 'payload' for full data
            # email_body = msg.get("payload", {}).get("body", {}).get("data")
            # if email_body:
            #     email_body = base64.urlsafe_b64decode(
            #         email_body.encode("ASCII")
            #     ).decode("utf-8")
            #     import pdb

            #     pdb.set_trace()
            # Choose file extension and content
            filename = f"{msg_id}.txt"  # or use ".json" and change content accordingly
            filepath = os.path.join(output_dir, filename)

            # Save the email to a file
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(data if data else email_data)

            print(f"Saved email {msg_id} to {filepath}")

    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f"An error occurred: {error}")


if __name__ == "__main__":
    main()
