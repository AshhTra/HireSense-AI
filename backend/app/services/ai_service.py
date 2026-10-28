
import os
import json
import asyncio

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env file")

client = genai.Client(api_key=api_key)

MODEL_NAME = "gemini-3.1-flash-lite"
MAX_ATTEMPTS = 3


async def analyze_resume(
    resume_text: str,
    job_description: str,
):
    print(">>> ANALYZING RESUME WITH GEMINI")

    prompt = f"""
You are an expert ATS resume analyzer.

Analyze the resume against the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY valid JSON with this exact structure:
{{
    "ats_score": 0,
    "matched_skills": [],
    "missing_skills": [],
    "suggestions": [],
    "recommended_roles": []
}}

Rules:
1. ats_score must be an integer from 0 to 100.
2. matched_skills: important skills present in both.
3. missing_skills: important job skills missing from the resume.
4. suggestions: practical, specific resume improvements.
5. recommended_roles: suitable roles based on the resume.
6. Keep the response concise and relevant.
7. Return only JSON, without markdown or explanations.
"""

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            print(f">>> GEMINI ATTEMPT {attempt}/{MAX_ATTEMPTS}")

            response = await asyncio.to_thread(
                client.models.generate_content,
                model=MODEL_NAME,
                contents=prompt,
                config={"response_mime_type": "application/json"},
            )

            if not response.text:
                raise ValueError("Gemini returned an empty response.")

            analysis = json.loads(response.text)

            required_keys = {
                "ats_score",
                "matched_skills",
                "missing_skills",
                "suggestions",
                "recommended_roles",
            }

            if not required_keys.issubset(analysis):
                raise ValueError("Gemini response is missing required fields.")

            score = analysis["ats_score"]

            if (
                not isinstance(score, int)
                or isinstance(score, bool)
                or not 0 <= score <= 100
            ):
                raise ValueError("Gemini returned an invalid ATS score.")

            for key in (
                "matched_skills",
                "missing_skills",
                "suggestions",
                "recommended_roles",
            ):
                if not isinstance(analysis[key], list):
                    raise ValueError(f"Invalid field format: {key}")

            print(">>> GEMINI ANALYSIS SUCCESSFUL")
            return analysis

        except Exception as e:
            print(f">>> GEMINI ATTEMPT {attempt} FAILED: {e}")

            if attempt == MAX_ATTEMPTS:
                raise RuntimeError(
                    "Resume analysis failed after 3 attempts. "
                    "Please try again later."
                ) from e

            await asyncio.sleep(2 ** attempt)
