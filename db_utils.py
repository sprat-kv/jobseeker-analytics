import psycopg2
from psycopg2 import extras
import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

# Load .env file
load_dotenv()

# Accessing environment variables
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")


def write_emails(emails: list):
    with psycopg2.connect(
        dbname=db_name, user=db_user, password=db_password, port=db_port
    ) as conn:
        with conn.cursor() as cur:
            query_create_table = """
            DROP TABLE IF EXISTS emails;
            CREATE TABLE emails (
                id SERIAL PRIMARY KEY,
                email_subject TEXT NOT NULL,
                email_from VARCHAR(255) NOT NULL,
                email_domain VARCHAR(100),
                company_name VARCHAR(255),
                received_at TIMESTAMP NOT NULL
            );
            """
            cur.execute(query_create_table)
            query_insert_emails = """
            INSERT INTO emails (email_subject, email_from, email_domain, company_name, received_at)
            VALUES %s """
            extras.execute_values(cur, query_insert_emails, emails)
            cur.execute("SELECT * FROM emails")
            cur.fetchone()
            for record in cur:
                print(record)
            conn.commit()


def export_to_csv(main_filepath: str, message_data: dict):
    logger.info(f"Exporting to CSV: {main_filepath}")
    if os.path.exists(main_filepath):  # TODO: dedupe records
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
        logger.info(f"Creating new CSV file: {main_filepath}")
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


def get_response_rate():
    import sqlite3
    import pandas as pd

    # Create a connection to the SQLite database
    conn = sqlite3.connect("jobs.db")
    cursor = conn.cursor()

    # Import CSV using pandas and write to SQLite
    df = pd.read_csv("./data/emails.csv")
    df.to_sql("jobs", conn, if_exists="replace", index=False)

    # Query the data
    cursor.execute(
        """SELECT DISTINCT CASE WHEN subject like '%interview%' then 1 ELSE 0 END as success, received_at FROM jobs WHERE top_word_company_proxy = 'Retool'"""
    )
    print(cursor.fetchall())

    # Close connection
    conn.close()


if __name__ == "__main__":
    get_response_rate()
