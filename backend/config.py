from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GOOGLE_SCOPES: str
    REDIRECT_URI: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_API_KEY: str
    COOKIE_SECRET: str
    DB_HOST: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_PORT: int
    ENV: str = "dev"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings(_env_file='.env', _env_file_encoding='utf-8')
