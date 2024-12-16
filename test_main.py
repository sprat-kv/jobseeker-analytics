from db_utils import write_emails
import datetime


# content of test_sample.py
def func(x):
    return x + 1


def test_answer():
    assert func(4) == 5


def test_write_emails():
    email_subject = "Important information about your application"
    email_from = "coolestco@domain.com"
    email_domain = "domain.com"
    company_name = "coolestco"
    email_dt = datetime.datetime.now()
    emails = [(email_subject, email_from, email_domain, company_name, email_dt)]
    write_emails(emails)
