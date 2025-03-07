from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from datetime import datetime

class UserData(BaseModel):
    user_id: str
    user_email: str
    google_openid: str
    start_date: datetime

class Users(SQLModel, table=True):
    __tablename__ = "users"
    user_id: str = Field(default = None, primary_key = True)
    user_email: str = Field(nullable=False)                      
    google_openid: str = Field(nullable=False, unique=True) # OpenID identifier
    start_date: datetime = Field(nullable=False) # Start date for job applications
