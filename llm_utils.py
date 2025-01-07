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
        ["rejected", "need to schedule technical interview", "need to schedule behavioral interview", "no response", "follow up", "technical interview scheduled", "behavioral interview scheduled"]
        Note that "no response" means that there is only an automated confirmation of the application being received.
        Note that "follow up" means that a company representative personally responded with confirmation of the application without defining next steps.
        Provide the output in JSON format, for example:  "company_name": "company_name", "application_status": "status" 
        Remove backticks. Only use double quotes. Enclose key and value pairs in a single pair of curly braces.
        If the email is obviously not related to a job application, return "na".
        Email: {email_text}
    """
    
    retries = 3  # Max retries
    delay = 30  # Initial delay
    for attempt in range(retries):
        try:
            logger.info("Calling generate_content")
            response: GenerateTextResponse = model.generate_content(prompt)
            response.resolve()
            response_json: str = response.text
            logger.info("Received response from model: %s", response_json)
            if response_json:
                cleaned_response_json = response_json.replace("`", "").replace("'", '"').strip()
                logger.info("Cleaned response: %s", cleaned_response_json)
                return json.loads(cleaned_response_json)
            else:
                logger.error("Empty response received from the model.")
                return None
        except Exception as e:
            if "429" in str(e):
                logger.warning(f"Rate limit hit. Retrying in {delay} seconds (attempt {attempt + 1}).")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                logger.error(f"Error processing email: {e}")
                return None
    logger.error(f"Failed to process email after {retries} attempts.")
    return None