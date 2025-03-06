from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class UserEmail(SQLModel, table=True):
    __tablename__ = "user_email"  
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str # in avoid google login id exceeding the integer limit 
    company_name: str
    application_status: str
    received_at: datetime
    subject: str
    email_from: str  # to avoid 'from' being a reserved key word