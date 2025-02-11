import logging
import os
import datetime
from fastapi import FastAPI, Request, Depends
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

from utils.file_utils import get_user_filepath
from session.session_layer import validate_session
from utils.config_utils import get_settings

# Import Google login routes
from login.google_login import router as google_login_router

app = FastAPI()
settings = get_settings()
app.add_middleware(SessionMiddleware, secret_key=settings.COOKIE_SECRET)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow Next.js frontend
    allow_credentials=True,  # Allow cookies (important for authentication)
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.add_middleware(SessionMiddleware, secret_key=settings.COOKIE_SECRET)

# Set up Jinja2 templates
templates = Jinja2Templates(directory="templates")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s - %(message)s")

api_call_finished = False

@app.get("/")
async def root(request: Request, response_class=HTMLResponse):
    return templates.TemplateResponse("homepage.html", {"request": request})

@app.get("/processing", response_class=HTMLResponse)
async def processing(request: Request, user_id: str = Depends(validate_session)):
    global api_call_finished
    if not user_id:
        return RedirectResponse("/logout", status_code=303)
    if api_call_finished:
        return RedirectResponse("/success", status_code=303)
    return templates.TemplateResponse("processing.html", {"request": request})

@app.get("/download-file")
async def download_file(request: Request, user_id: str = Depends(validate_session)):
    if not user_id:
        return RedirectResponse("/logout", status_code=303)
    directory = get_user_filepath(user_id)
    filename = "emails.csv"
    filepath = f"{directory}/{filename}"
    if os.path.exists(filepath):
        return FileResponse(filepath)
    return HTMLResponse(content="File not found :(", status_code=404)

@app.get("/success", response_class=HTMLResponse)
def success(request: Request, user_id: str = Depends(validate_session)):
    if not user_id:
        return RedirectResponse("/logout", status_code=303)
    today = str(datetime.date.today())
    return templates.TemplateResponse("success.html", {"request": request, "today": today})

# Register Google login routes
app.include_router(google_login_router)