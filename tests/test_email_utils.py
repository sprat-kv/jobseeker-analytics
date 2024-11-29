from tests.constants import SAMPLE_MESSAGE
import email_utils


def test_get_email_subject_line():
    subject_line = email_utils.get_email_subject_line(SAMPLE_MESSAGE)
    assert (
        subject_line
        == "Invitation from an unknown sender: Interview with TestCompanyName @ Thu May 2, 2024 11:00am - 12pm (PDT) (appuser@gmail.com)"
    )


def test_get_email_from_address():
    from_address = email_utils.get_email_from_address(SAMPLE_MESSAGE)
    assert from_address == "recruitername@testcompanyname.com"


def test_get_email_domain():
    from_email_domain = email_utils.get_email_domain_from_address(
        "recruitername@testcompanyname.com"
    )
    assert from_email_domain == "testcompanyname.com"


def test_get_company_name():
    pass


def test_get_email_received_at():
    pass
