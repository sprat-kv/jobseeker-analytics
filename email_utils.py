def get_email_payload(msg):
    return msg.get("payload", None)


def get_email_headers(msg):
    email_data = get_email_payload(msg)
    if email_data:
        return email_data.get("headers", None)
    return None


def get_email_parts(msg):
    email_data = get_email_payload(msg)
    if email_data:
        return email_data.get("parts", None)
    return None


def get_email_subject_line(msg):
    email_headers = get_email_headers(msg)
    if email_headers:
        for header in email_headers:
            key = header.get("name")  # convert to dict for O(1) lookup ?
            if key == "Subject":
                return header.get("value")
    return ""


def get_email_from_address(msg):
    email_headers = get_email_headers(msg)
    if email_headers:
        for header in email_headers:
            key = header.get("name")
            if key == "Return-Path":
                return header.get("value").strip("<").strip(">")
    return ""


def get_email_domain_from_address(email_address):
    return email_address.split("@")[1]
