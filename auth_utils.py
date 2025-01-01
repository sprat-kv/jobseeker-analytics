from google.oauth2.credentials import Credentials

class AuthenticatedUser:
    """
    The AuthenticatedUser class is used to 
    store information about the user. This
    class is instantiated after the user has
    successfully authenticated with Google.
    """
    def __init__(self, creds: Credentials):
        self.creds = creds
        self.user_id = self.get_user_id()
        self.filepath = self.get_user_filepath()

    def get_user_id(self) -> str:
        """
        Retrieves the user ID from Google OAuth2 credentials.

        Parameters:
        - credentials: The Google OAuth2 credentials object.

        Returns:
        - user_id: The unique user ID.
        """
        user_info = self.creds.id_token
        user_id = user_info['sub']  # 'sub' is the unique user ID
        return user_id

    def get_user_filepath(self) -> str:
        """
        Each user has their own directory to store their data.
        """
        return f"users/{self.user_id}/"


def get_user() -> AuthenticatedUser:
    """Handles the OAuth2 flow and retrieves user credentials."""
    creds = None
    logger.info("Checking for existing credentials...")
    # If modifying these scopes, delete the file token.json.
    SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
    CLIENT_SECRETS_FILE = "credentials.json"

    # Try to load existing credentials from token.json
    if os.path.exists('token.json'):
        logger.info("Loading existing credentials...")
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            logger.info("Refreshing expired credentials...")
            creds.refresh(Request())
        else:
            logger.info("No valid credentials found. Redirecting to authorization URL...")
            flow = Flow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES, 
                redirect_uri="https://jobseeker-analytics.onrender.com/get-jobs"
            )
            authorization_url, state = flow.authorization_url(prompt="consent")
            logger.info("Authorization URL: %s", authorization_url)
            logger.info("State: %s", state)
            return authorization_url  # Return the authorization URL for user to visit

    # Save credentials for the next run
    with open('token.json', 'w', encoding='utf-8') as token_file:
        logger.info("Saving credentials...")
        token_file.write(creds.to_json())

    return AuthenticatedUser(creds)
