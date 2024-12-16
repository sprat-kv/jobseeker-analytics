import os.path
import base64

from bs4 import BeautifulSoup
import re


from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from constants import QUERY_APPLIED_EMAIL_FILTER
from db_utils import write_emails
from email_utils import (
    clean_email,
    get_word_frequency,
    get_gmail_credentials,
    get_message,
    get_company_name,
    get_received_at_timestamp,
    get_email_subject_line,
    get_email_domain_from_address,
    get_email_from_address,
)
import datetime


JOBS_LABEL_ID = "Label_7646018251861665561"
# ideally would be able to programmatically fetch job application-related emails but in interest of time,
# I manually filtered and placed in this label 'jobs' with this id starting with Label_


def main():
    creds = get_gmail_credentials()
    try:
        # Call the Gmail API
        service = build("gmail", "v1", credentials=creds)
        # results = service.users().labels().list(userId="me").execute()
        # labels = results.get("labels", [])
        results = (
            service.users()
            .messages()
            .list(userId="me", q=QUERY_APPLIED_EMAIL_FILTER, includeSpamTrash=True)
            .execute()
        )

        messages = results.get("messages", [])
        next_page_token = results.get("nextPageToken", "")
        size_estimate = results.get("resultSizeEstimate", 0)
        print("next page token {}".format(next_page_token))
        print("size estimate {}".format(size_estimate))
        # print(results)
        if not results:
            print("No message found.")
            return

        # Directory to save the emails
        output_dir = "emails_v2"
        os.makedirs(output_dir, exist_ok=True)
        emails_data = []
        for message in messages:
            message_data = {}
            # (email_subject, email_from, email_domain, company_name, email_dt)
            msg_id = message["id"]
            msg = get_message(id=msg_id, gmail_instance=service)
            email_data = msg["payload"]["headers"]

            for values in email_data:
                name = values["name"]
                if name == "From":
                    from_name = values["value"]
                    print(from_name)
                    subject = [j["value"] for j in email_data if j["name"] == "Subject"]
                    print(subject)
                    if message_data.get("subject"):
                        message_data["subject"].append(subject)
                    else:
                        message_data["subject"] = [subject]
                    if message_data.get("from_name"):
                        message_data["from_name"].append(from_name)
                    else:
                        message_data["from_name"] = [from_name]
                if name == "ARC-Authentication-Results":
                    print("yes ARC")
                    arc_authentication_results = values["value"]
                    fromdomain_pattern = r"from=([\w.-]+)"
                    fromdomain_matches = re.findall(
                        fromdomain_pattern, arc_authentication_results
                    )
                    fromdomain_match = (
                        fromdomain_matches[0] if fromdomain_matches else ""
                    )
                    if message_data.get("fromdomain_match"):
                        message_data["fromdomain_match"].append(fromdomain_match)
                    else:
                        message_data["fromdomain_match"] = [fromdomain_match]

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
                            cleaned_text = clean_email(email_text)

                            if cleaned_text:
                                word_frequency = get_word_frequency(cleaned_text)
                                print(word_frequency)
                                top_word_company_proxy = word_frequency[0][0]
                                if message_data.get("top_word_company_proxy"):
                                    message_data["top_word_company_proxy"].append(
                                        top_word_company_proxy
                                    )
                                else:
                                    message_data["top_word_company_proxy"] = [
                                        top_word_company_proxy
                                    ]
                                filename = f"{msg_id}.txt"  # or use ".json" and change content accordingly
                                filepath = os.path.join(output_dir, filename)

                                print(f"Saved email {msg_id} to {filepath}")

                else:
                    # '18fe32d9f3325ccb', '18fe57a5ea4b9650', '190093da22ff5e29'
                    print(
                        "this payload doesnt have parts for message {id}".format(
                            id=msg_id
                        )
                    )
            message_data["received_at"] = [datetime.datetime.now()]
            emails_data.append(message_data)
            break
        cleaned_emails = []
        for email_dict in emails_data:
            cleaned_email = []
            for key in email_dict:
                cleaned_email.append(email_dict[key][0])
                continue
            cleaned_emails.append(tuple(cleaned_email))
        write_emails(cleaned_emails)
    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f"An error occurred: {error}")


if __name__ == "__main__":
    main()
