import logging
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

# Logger setup
logger = logging.getLogger(__name__)

# In-memory storage for start date (for demonstration purposes)
start_date_storage = {}

router = APIRouter()

@router.post("/api/save-start-date")
async def save_start_date(request: Request):
    logger.info(f"Session after save-start-date: {request.session}")  # Debugging
    data = await request.json()
    start_date_storage["start_date"] = data.get("start_date")
    return JSONResponse(content={"message": "Start date saved successfully"})

@router.get("/api/get-start-date")
async def get_start_date(request: Request):
    start_date = start_date_storage.get("start_date")
    return JSONResponse(content={"start_date": start_date})