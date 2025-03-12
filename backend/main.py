import datetime
import logging
import os

from fastapi import FastAPI, Request, Depends
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from db.users import UserData
from db.utils.user_utils import add_user
from utils.file_utils import get_user_filepath
from utils.config_utils import get_settings
from session.session_layer import validate_session

# Import routes
from routes import playground_routes, auth, email_routes

app = FastAPI()
settings = get_settings()
APP_URL = settings.APP_URL
app.add_middleware(SessionMiddleware, secret_key=settings.COOKIE_SECRET)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register routes
app.include_router(auth.router)
app.include_router(playground_routes.router)
app.include_router(email_routes.router)

# Configure CORS
if settings.is_publicly_deployed:
    # Production CORS settings
    origins = ["https://www.jobba.help", "https://www.staging.jobba.help"]
else:
    # Development CORS settings
    origins = [
        "http://localhost:3000",  # Assuming frontend runs on port 3000
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Set up Jinja2 templates
templates = Jinja2Templates(directory="templates")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s - %(message)s")

api_call_finished = False

@app.post("/api/add-user")
async def add_user_endpoint(user_data: UserData):
    """
    This endpoint adds a user to the database
    """
    try:
        add_user(user_data)
        return {"message": "User added successfully"}
    except Exception as e:
        # Log the error for debugging purposes
        logger.error(f"An error occurred while adding user: {e}")
        return {"error": "An error occurred while adding the user."}


@app.get("/")
async def root(request: Request, response_class=HTMLResponse):
    return templates.TemplateResponse("homepage.html", {"request": request})


@app.get("/processing", response_class=HTMLResponse)
async def processing(request: Request, user_id: str = Depends(validate_session)):
    logging.info("user_id:%s processing", user_id)
    global api_call_finished
    if not user_id:
        logger.info("user_id: not found, redirecting to login")
        return RedirectResponse("/logout", status_code=303)
    if api_call_finished:
        logger.info("user_id: %s processing complete", user_id)
        return JSONResponse(
            content={
                "message": "Processing complete",
                "redirect_url": f"{APP_URL}/success",
            }
        )
    else:
        logger.info("user_id: %s processing not complete for file", user_id)
        return JSONResponse(content={"message": "Processing in progress"})


@app.get("/download-file")
async def download_file(request: Request, user_id: str = Depends(validate_session)):
    if not user_id:
        return RedirectResponse("/logout", status_code=303)
    directory = get_user_filepath(user_id)
    filename = "emails.csv"
    filepath = f"{directory}/{filename}"
    if os.path.exists(filepath):
        logger.info("user_id:%s downloading from filepath %s", user_id, filepath)
        return FileResponse(filepath)
    return HTMLResponse(content="File not found :( ", status_code=404)


@app.get("/success", response_class=HTMLResponse)
def success(request: Request, user_id: str = Depends(validate_session)):
    if not user_id:
        return RedirectResponse("/logout", status_code=303)
    today = str(datetime.date.today())
    return templates.TemplateResponse(
        "success.html", {"request": request, "today": today}
    )


# Run the app using Uvicorn
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
