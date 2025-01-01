import os
import logging
from auth_utils import AuthenticatedUser

logger = logging.getLogger(__name__)


def export_to_csv(user: AuthenticatedUser, message_data: dict):
    """
    Creates a CSV file in the user's directory and appends the message data to it.
    """
    main_filepath = user.filepath + "emails.csv"
    logger.info("user_id:%s exporting to CSV", user.user_id)
    if os.path.exists(main_filepath):  # TODO: dedupe records
        logger.info("user_id:%s appending to existing CSV file", user.user_id)
        with open(main_filepath, "a", encoding="utf-8") as f:
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
        logger.info("user_id:%s creating new CSV file", user.user_id)
        with open(main_filepath, "w", encoding="utf-8") as f:
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

