import re
import pandas as pd

# --- Dictionaries and Constants ---

INVALID_TITLES = {}


# Expanded levels to capture more variations.
LEVELS = {
    'Executive': [
        'ceo', 'chief executive officer', 'cxo', 'c-level', 'chief', 'founder', 'co-founder', 'president', 'vp', 'vice president',
        'executive director', 'head of', 'director', 'senior vice president', 'svp', 'chief operating officer', 'coo', 'chief technology officer',
        'cto', 'chief financial officer', 'cfo', 'chief marketing officer', 'cmo', 'chief product officer', 'cpo', 'chief information officer',
        'cio', 'chief data officer', 'cdo', 'chief compliance officer', 'cco', 'chief risk officer', 'cro', 'chief security officer', 'cso',
        'chief human resources officer', 'chro', 'chief legal officer', 'clo', 'chief strategy officer', 'cso', 'fractional'
    ],
    'Manager': [
        'manager', 'supervisor'
    ],
    'Senior': [
        'senior', 'sr', 'lead', 'principal', 'staff', 'architect', 'founding', 'iv', 'v', 'iii'
    ],
    'Junior': [
        'junior', 'jr', 'entry level', 'i', 'ii', 'intern', 'internship', 'trainee', 
        'fellow', 'graduate', 'apprentice', 'co-op', 'student', 'new grad', 'new graduate'
    ]
}

# Common job role types - words that typically appear at the end of job titles
JOB_ROLE_TYPES = {
    'engineer', 'developer', 'analyst', 'manager', 'director', 'coordinator', 'specialist', 'consultant',
    'administrator', 'assistant', 'associate', 'representative', 'executive', 'officer', 'lead', 'head',
    'supervisor', 'technician', 'designer', 'architect', 'scientist', 'researcher', 'writer', 'editor',
    'marketer', 'recruiter', 'salesperson', 'accountant', 'lawyer', 'paralegal', 'nurse', 'doctor',
    'teacher', 'professor', 'instructor', 'trainer', 'planner', 'strategist', 'advisor', 'counselor',
    'therapist', 'clerk', 'secretary', 'receptionist', 'operator', 'driver', 'mechanic', 'electrician',
    'plumber', 'carpenter', 'chef', 'cook', 'server', 'bartender', 'cashier', 'teller', 'guard',
    'janitor', 'custodian', 'maintenance', 'technologist', 'programmer', 'coder', 'tester', 'auditor',
    'reviewer', 'inspector', 'investigator', 'agent', 'broker', 'trader', 'buyer', 'seller', 'merchandiser',
    'coordinator', 'facilitator', 'organizer', 'scheduler', 'dispatcher', 'controller', 'supervisor',
    'foreman', 'superintendent', 'principal', 'dean', 'provost', 'chancellor', 'president', 'ceo',
    'cfo', 'cto', 'coo', 'cmo', 'cpo', 'cio', 'intern', 'apprentice', 'trainee', 'fellow', 'employee'
}

# --- Helper and Main Functions ---

def is_job_role_word(word):
    """Check if a word is likely a job role type."""
    return word.lower() in JOB_ROLE_TYPES

def ends_with_job_role(title):
    """Check if the title ends with a recognized job role word."""
    if not title:
        return False
    words = title.strip().split()
    if not words:
        return False
    return is_job_role_word(words[-1])

def preprocess_title(title):
    """Cleans a raw job title string for further processing."""
    if not isinstance(title, str):
        return ""
    
    title = title.lower()
    title = re.sub(r'\[.*?\]|\(.*?\)|#.*|:.+', '', title) # More aggressive cleaning
    
    # Remove all text after the first dash (regular hyphen, em dash, en dash)
    # But be smart about it - if what comes after the dash ends with a job role, keep that instead
    if re.search(r'\s*[-–—]\s*', title):
        parts = re.split(r'\s*[-–—]\s*', title, 1)  # Split on first dash only
        if len(parts) == 2:
            before_dash = parts[0].strip()
            after_dash = parts[1].strip()
            
            # Check if either part contains a job role
            before_has_job_role = ends_with_job_role(before_dash)
            after_has_job_role = ends_with_job_role(after_dash)
            
            # Priority: prefer the part that ends with a job role
            if after_has_job_role and not before_has_job_role:
                title = after_dash
            elif before_has_job_role and not after_has_job_role:
                title = before_dash
            # If both or neither have job roles, check which contains more job role words
            else:
                # Clean punctuation when counting job role words
                before_job_words = sum(1 for word in before_dash.split() if is_job_role_word(re.sub(r'[^\w]', '', word)))
                after_job_words = sum(1 for word in after_dash.split() if is_job_role_word(re.sub(r'[^\w]', '', word)))
                
                if after_job_words > before_job_words:
                    title = after_dash
                elif before_job_words > after_job_words:
                    title = before_dash
                else:
                    # Default to after dash if it has job role words, otherwise before
                    title = after_dash if after_job_words > 0 else before_dash
    
    # Remove text after comma only if it looks like location info (keep first part)
    # Only split on comma if what comes after doesn't end with a job role
    if ',' in title:
        comma_parts = title.split(',')
        if len(comma_parts) > 1:
            # Check if any part after first comma ends with job role
            has_job_role_after_comma = any(ends_with_job_role(part.strip()) for part in comma_parts[1:])
            if not has_job_role_after_comma:
                title = comma_parts[0].strip()
            # Otherwise keep the whole title
    
    # remove all text after a slash or pipe
    if '/' in title or '|' in title:
        title = re.sub(r'\s*[/|].*', '', title).strip()
    
    # Remove company names or anything after " at " - but only if what remains ends with a job role
    if ' at ' in title:
        title_before_at = title.split(' at ')[0].strip()
        if ends_with_job_role(title_before_at):
            title = title_before_at
        # Otherwise keep the full title including company name
    
    # Clean up remaining characters
    title = re.sub(r'[^a-z0-9\s]', '', title) # Keep only alphanumeric and spaces
    title = re.sub(r'\s+', ' ', title).strip()
    
    return title

def normalize_job_title(title):
    """
    Normalizes a raw job title into a standardized format.
    Returns a normalized string or None if the title is invalid.
    """
    if not isinstance(title, str):
        return None

    title_lower = title.lower()
    
    # Check for invalid titles using word boundaries to avoid partial matches
    for invalid in INVALID_TITLES:
        # Use word boundaries for single words, exact match for phrases
        if len(invalid.split()) == 1:
            if re.search(r'\b' + re.escape(invalid) + r'\b', title_lower):
                return None
        else:
            if invalid in title_lower:
                return None

    clean_title = preprocess_title(title)
    if not clean_title:
        return None

    return clean_title

# --- Main Execution Block ---

if __name__ == '__main__':
    try:
        # To test with the list you provided, we can create a DataFrame in memory
        
        
        # Or load from your CSV file
        df = pd.read_csv('job_titles_aug2025.csv')

        df['normalized_title'] = df['job_title'].apply(normalize_job_title)
        
        output_df = df[['job_title', 'normalized_title']]
        output_filename = 'normalized_job_titles_fixed.csv'
        output_df.to_csv(output_filename, index=False)
        
        print(f"✅ Success! Job titles have been processed.")
        print(f"Results saved to: {output_filename}")
        
        print("\n--- Sample of Normalization Results ---")
        pd.set_option('display.max_rows', 150)
        pd.set_option('display.max_colwidth', 80)
        print(output_df.dropna(subset=['normalized_title']).sample(min(50, len(output_df.dropna()))))
        
    except Exception as e:
        print(f"\n❌ An unexpected error occurred: {e}")