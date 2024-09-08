import os.path
import base64
import spacy
from bs4 import BeautifulSoup
import re

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


def get_gmail_credentials():
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
            try:
                flow = InstalledAppFlow.from_client_secrets_file(
                    "credentials.json",
                    scopes=SCOPES,
                )
                creds = flow.run_local_server(port=8001)
            except RefreshError:
                os.remove("token.json")
                creds.refresh(Request())
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return creds


def clean_email(payload):
    nlp = spacy.load("en_core_web_sm")


def save_emails_to_database(payload):
    conn = sqlite3.connect("jobapps.db")
    pass


def main():
    creds = get_gmail_credentials()
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
            # if msg_id == "1901318a60244309":
            #     import pdb

            #     pdb.set_trace()
            # else:
            #     continue

            msg = service.users().messages().get(userId="me", id=msg_id).execute()
            email_data = msg["payload"]["headers"]

            for values in email_data:
                name = values["name"]
                if name == "From":
                    from_name = values["value"]
                    print(from_name)
                    subject = [j["value"] for j in email_data if j["name"] == "Subject"]
                    print(subject)
                if name == "ARC-Authentication-Results":
                    arc_authentication_results = values["value"]
                    fromdomain_pattern = r"from=([\w.-]+)"
                    fromdomain_matches = re.findall(
                        fromdomain_pattern, arc_authentication_results
                    )
                    for domain in fromdomain_matches:
                        print(
                            "domain: {domain_alt}".format(
                                domain_alt=domain.split(".")[0]
                            )
                        )

            payload = msg.get("payload")
            if payload:
                payload_parts = payload.get("parts")
                if payload_parts:
                    for p in payload_parts:
                        if p["mimeType"] in ["text/plain", "text/html"]:
                            data = base64.urlsafe_b64decode(
                                p.get("body", {}).get("data", {})
                            ).decode("utf-8")
                            # Parse the content with BeautifulSoup
                            soup = BeautifulSoup(data, "html.parser")

                            # Extract the plain text from the HTML content
                            email_text = soup.get_text()
                            email_text_nlp = nlp(email_text)
                            cleaned_text = [
                                str(token)
                                for token in email_text_nlp
                                if not token.is_stop and not token.is_punct
                            ]

                            # Optional: Clean up extra whitespace and line breaks
                            # cleaned_text = "\n".join(
                            #     [
                            #         line.strip()
                            #         for line in email_text.splitlines()
                            #         if line.strip()
                            #     ]
                            # )

                            # print(data)
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
                            if cleaned_text:

                                filename = f"{msg_id}.txt"  # or use ".json" and change content accordingly
                                filepath = os.path.join(output_dir, filename)

                                # Save the email to a file
                                with open(filepath, "w", encoding="utf-8") as f:
                                    for line in cleaned_text:
                                        if line.strip():
                                            f.write(f"{line}\n")

                                print(f"Saved email {msg_id} to {filepath}")
                else:
                    # '18fe32d9f3325ccb', '18fe57a5ea4b9650', '190093da22ff5e29'
                    print(
                        "this payload doesnt have parts for message {id}".format(
                            id=msg_id
                        )
                    )
    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f"An error occurred: {error}")


if __name__ == "__main__":
    main()
