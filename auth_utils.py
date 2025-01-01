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

