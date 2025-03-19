import logging
from fastapi import APIRouter, Request, FastAPI, BackgroundTasks
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

# Logger setup
logger = logging.getLogger(__name__)

api_call_finished = False

# FastAPI router for email routes
router = APIRouter()

@router.post("/api/save-start-date")
async def save_start_date(request: Request):
    logger.info(f"Session after save-start-date: {request.session}")  # Debugging
    data = await request.json()
    start_date_storage["start_date"] = data.get("start_date")
    return JSONResponse(content={"message": "Start date saved successfully"})

@router.get("/api/get-start-date")
async def get_start_date():
    start_date = start_date_storage.get("start_date")
    return JSONResponse(content={"start_date": start_date if start_date else ""})

@router.post("/api/fetch-emails")
async def fetch_emails_endpoint(request: Request, background_tasks: BackgroundTasks):
    logger.info(f"Session data at fetch-emails: {request.session}") 
    data = await request.json()
    user_id = data.get("user_id")
    if not user_id:
        return JSONResponse(content={"error": "Missing user_id"}, status_code=400)
    # Retrieve credentials from session
    creds_json = request.session.get("creds")
    if not creds_json:
        return JSONResponse(content={"error": "Missing credentials"}, status_code=400)
    creds = Credentials.from_authorized_user_info(json.loads(creds_json))
    user = AuthenticatedUser(creds)
    background_tasks.add_task(fetch_emails, user)
    return JSONResponse(content={"message": "Email fetching started"})

@router.get("/api/session-data")
async def get_session_data(request: Request):
    logger.info(f"Session data at dashboard: {request.session}") 
    session_data = {
        "user_id": request.session.get("user_id"),
        "token_expiry": request.session.get("token_expiry"),
        "session_id": request.session.get("session_id"),
    }
    return JSONResponse(content=session_data)