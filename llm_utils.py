import google.generativeai as genai
import time
import json
import os
from google.ai.generativelanguage_v1beta2 import GenerateTextResponse
from dotenv import load_dotenv
import logging
load_dotenv()

# Configure Google Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-pro')
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def process_email(email_text):
    prompt = f"""
        Extract the company name and job application status from the following email. 
        Job application status can be a value from the following list: 
        ["received", "rejected", "need to schedule technical interview", "need to schedule behavioral interview", "waiting for response", "technical interview scheduled", "behavioral interview scheduled"]
        Provide the output in JSON format, for example: {"company_name": "company_name", "application_status": "status"} 
        Do not add extra formatting, just return the curly braces and the keys and values.
        Email: {email_text}
    """
    
    retries = 3  # Max retries
    delay = 1  # Initial delay
    for attempt in range(retries):
        try:
            logger.info("Calling generate_content")
            response: GenerateTextResponse = model.generate_content(prompt)
            response.resolve()
            response_json: str = response.text
            if response_json.strip():
                logger.info("Received response from model: %s", response_json)
                return json.loads(response_json)
            else:
                logger.error("Empty response received from the model.")
                return None
        except Exception as e:
            if hasattr(e, 'status_code') and e.status_code == 429:
                logger.warning(f"Rate limit hit. Retrying in {delay} seconds (attempt {attempt + 1}).")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                logger.error(f"Error processing email: {e}")
                return None
    logger.error(f"Failed to process email after {retries} attempts.")
    return None