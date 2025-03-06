from sqlmodel import Session
from email.utils import parsedate_to_datetime
from db.user_email import UserEmail
from datetime import datetime
import re
import logging

logger = logging.getLogger(__name__)

def parse_email_date(date_str: str) -> datetime:
    """
    Converts an email date string into a Python datetime object.
    
    Supports several common formats, for example:
      - "Fri, 28 Feb 2025 06:54:37 +0000 (UTC)"
      - "19 Jan 2025 09:58:56 -0500"
      - "Fri, 28 Feb 2025 06:54:37 +0000"
      - "19 Jan 2025 09:58:56 GMT"
      
    """
    # remove any content in parentheses (e.g., "(UTC)")
    date_str = re.sub(r"\(.*\)", "", date_str).strip()
    
    # define a list of possible date formats
    possible_formats = [
        "%a, %d %b %Y %H:%M:%S %z",  # e.g., "Fri, 28 Feb 2025 06:54:37 +0000"
        "%d %b %Y %H:%M:%S %z",       # e.g., "19 Jan 2025 09:58:56 -0500"
        "%a, %d %b %Y %H:%M:%S %Z",   # e.g., "Fri, 28 Feb 2025 06:54:37 GMT"
        "%d %b %Y %H:%M:%S %Z",       # e.g., "19 Jan 2025 09:58:56 GMT"
    ]
    
    for fmt in possible_formats:
        try:
            # try parsing using the current format.
            parsed_date = datetime.strptime(date_str, fmt)
            return parsed_date
        except ValueError:
            continue 

    # if none of the formats work, raise an error.
    raise ValueError(f"Unrecognized date format: {date_str}")


def add_user_email(user, message_data: dict, session: Session) -> None:
    """
    Insert email record into the user_emails table.
    """
    received_at_str = message_data["received_at"][0]
    received_at = parse_email_date(received_at_str) # parse_email_date function was created as different date formats were being pulled from the data
    
    email_record = UserEmail(
    user_id=user.user_id,
    company_name=message_data["company_name"][0],
    application_status=message_data["application_status"][0],
    received_at=received_at,
    subject=message_data["subject"][0],
    email_from=message_data["from"][0]
    )
    session.add(email_record)
    session.commit()
    session.refresh(email_record)
    logger.info(f"Added email record for user {user.user_id}")