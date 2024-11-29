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


def clean_email(email_body):
    import spacy
    from spacy_cleaner import processing, Cleaner

    model = spacy.load("en_core_web_sm")
    pipeline = Cleaner(
        model,
        processing.remove_stopword_token,
        processing.remove_punctuation_token,
        processing.remove_number_token,
    )
    return pipeline.clean([email_body])


def get_word_frequency(cleaned_email):
    word_dict = {}
    for word in cleaned_email[0].split(" "):
        if word not in word_dict:
            word_dict[word] = 1
        else:
            word_dict[word] += 1

    word_dict_sorted = sorted(word_dict.items(), key=lambda item: item[1], reverse=True)
    return word_dict_sorted


def get_top_word_in_email_body(msg):
    import base64
    from bs4 import BeautifulSoup

    parts = get_email_parts(msg)
    print("ok!")
    if parts:
        for part in parts:
            print("its a part!")
            print(part)
            if part.get("mimeType") not in [
                "text/plain",
                "text/html",
            ]:
                continue
            if part.get("mimeType") and part.get("mimeType") in [
                "text/plain",
                "text/html",
            ]:
                data = base64.urlsafe_b64decode(
                    part.get("body", {}).get("data", {})
                ).decode("utf-8")
                # Parse the content with BeautifulSoup
                soup = BeautifulSoup(data, "html.parser")
                # Extract the plain text from the HTML content
                email_text = soup.get_text()
                cleaned_text = clean_email(email_text)
                if cleaned_text:
                    word_frequency = get_word_frequency(cleaned_text)
                    print(word_frequency)
                if len(word_frequency) > 0:
                    if len(word_frequency[0]) > 0:
                        return word_frequency[0][0]


def get_company_name(msg):
    top_word = get_top_word_in_email_body(msg)
    if not top_word:
        # likely a calendar invite
        # return email domain
        from_address = get_email_from_address(msg)
        return get_email_domain_from_address(from_address).split(".")[0]
