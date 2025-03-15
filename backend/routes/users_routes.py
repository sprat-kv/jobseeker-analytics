import os
import logging
from typing import List
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from sqlmodel import Session, select
from googleapiclient.discovery import build
from constants import QUERY_APPLIED_EMAIL_FILTER
from db.user_email import UserEmail
from db.utils.user_email_utils import create_user_email
from utils.auth_utils import AuthenticatedUser
from utils.email_utils import get_email_ids, get_email
from utils.llm_utils import process_email
from utils.db_utils import export_to_csv
from utils.config_utils import get_settings
from session.session_layer import validate_session
from database import engine

# Logger setup
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()
APP_URL = settings.APP_URL

api_call_finished = False

# FastAPI router for email routes
router = APIRouter()

@router.get("/user/{user_id}/response_rate")
def calculate_response_rate(user_id: str, request: Request) -> None:
    with Session(engine) as session:
        user_emails = session.exec(select(UserEmail).where(UserEmail.user_id == user_id)).all()

        # if user has no application just return 0.0
        total_apps = len(user_emails)
        if total_apps == 0:
            return {"response_rate": 0.0}

        interview_requests = 0
        for email in user_emails:
            if email.application_status and email.application_status.lower() == "request for availability":
                interview_requests += 1

        response_rate_percent = (interview_requests / total_apps) * 100
        return round(response_rate_percent, 1)
