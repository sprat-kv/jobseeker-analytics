def get_email_headers(msg):
    email_data = msg.get("payload", None)
    if email_data:
        return email_data.get("headers", None)
    return None


def get_email_subject_line(msg):
    email_headers = get_email_headers(msg)
    if email_headers:
        for header in email_headers:
            key = header.get("name")  # convert to dict for O(1) lookup ?
            if key == "Subject":
                return header.get("value")
    return ""
