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
        print("Labels:")
        for message in messages:
            message_id = message["id"]
            # GET https://gmail.googleapis.com/gmail/v1/users/{userId}/messages/{id}
            results = (
                service.users().messages().get(id=message_id, userId="me").execute()
            )

            parts = results.get("payload").get("parts")

            i = 0
            for val in parts:
                if val.get("partId") == "0":
                    print("here", val.keys())
                    for part in val.get("parts"):
                        email_body = part.get("body").get("data")
                        if email_body:
                            decoded_email_body = base64.urlsafe_b64decode(email_body)
                            print(type(decoded_email_body))

                break

    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f"An error occurred: {error}")


if __name__ == "__main__":
    main()
