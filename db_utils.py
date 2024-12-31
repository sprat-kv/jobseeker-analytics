import psycopg2
from psycopg2 import extras
import os
from dotenv import load_dotenv
import logging
from auth_utils import AuthenticatedUser

logger = logging.getLogger(__name__)


def export_to_csv(user: AuthenticatedUser, message_data: dict):
    """
    Creates a CSV file in the user's directory and appends the message data to it.
    """
    main_filepath = user.filepath + "emails.csv"
    logger.info(f"user_id:{user.user_id} exporting to CSV")
    if os.path.exists(main_filepath):  # TODO: dedupe records
        logger.info(f"user_id:{user.user_id} appending to existing CSV file")
        with open(main_filepath, "a") as f:
            values = ",".join(
                (
                    f'"{str(message_data[key][0])}"'
                    if "," in str(message_data[key][0])
                    else str(message_data[key][0])
                )
                for key in message_data
            )
            f.write(values + "\n")
    else:
        logger.info(f"user_id:{user.user_id} creating new CSV file")
        with open(main_filepath, "w") as f:
            headers = ",".join(message_data.keys())
            f.write(headers + "\n")
            values = ",".join(
                (
                    f'"{str(message_data[key][0])}"'
                    if "," in str(message_data[key][0])
                    else str(message_data[key][0])
                )
                for key in message_data
            )
            f.write(values + "\n")
    return main_filepath


if __name__ == "__main__":
    get_response_rate()
