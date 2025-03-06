from db.user_email import UserEmail
from datetime import datetime, timezone
import email.utils
import logging

logger = logging.getLogger(__name__)

def parse_email_date(date_str: str) -> datetime:
    """
    Converts an email date string into a Python datetime object
    """
    dt = email.utils.parsedate_to_datetime(date_str)
    if dt is None:
        # default to current UTC datetime
        dt = datetime.now(timezone.utc)
    return dt


def create_user_email(user, message_data: dict) -> UserEmail:
    """
    Creates a UserEmail record instance from the provided data.
    """
    received_at_str = message_data["received_at"][0]
    received_at = parse_email_date(received_at_str) # parse_email_date function was created as different date formats were being pulled from the data
    
    return UserEmail(
        user_id=user.user_id,  
        company_name=message_data["company_name"][0],
        application_status=message_data["application_status"][0],
        received_at=received_at,
        subject=message_data["subject"][0],
        email_from=message_data["from"][0]
    )
