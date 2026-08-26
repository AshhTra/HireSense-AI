import os
import json

from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env file")

# Create Gemini client
client = genai.Client(api_key=api_key)


async def analyze_resume(
    resume_text: str,
    job_description: str
):
    print(">>> ANALYZING RESUME WITH GEMINI")

    prompt = f"""
You are an expert ATS resume analyzer.

Analyze the following resume against the given job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "ats_score": 0,
    "matched_skills": [],
    "missing_skills": [],
    "suggestions": [],
    "recommended_roles": []
}}

Rules:

1. ats_score must be an integer between 0 and 100.

2. matched_skills:
Include important skills that are present in both the resume
and the job description.

3. missing_skills:
Include important skills mentioned in the job description
that are missing from the resume.

4. suggestions:
Give practical and specific suggestions to improve the resume
for this job.

5. recommended_roles:
Suggest suitable job roles based on the resume.

6. Keep the response concise and relevant.

7. Return ONLY JSON.
Do not add markdown.
Do not add ```json.
Do not add explanations before or after the JSON.
"""

    try:
        print(">>> CALLING GEMINI API")

        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        print(">>> GEMINI RESPONSE RECEIVED")

        result = response.text

        print(">>> GEMINI RAW RESPONSE:")
        print(result)

        # Convert Gemini JSON string into Python dictionary
        analysis = json.loads(result)

        return analysis

    except json.JSONDecodeError:
        print(">>> ERROR: Gemini returned invalid JSON")

        return {
            "ats_score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "suggestions": [
                "Gemini returned an invalid JSON response."
            ],
            "recommended_roles": []
        }

    except Exception as e:
        print(">>> GEMINI ERROR:", repr(e))

        return {
            "ats_score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "suggestions": [
                f"Gemini API error: {str(e)}"
            ],
            "recommended_roles": []
        }