
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

MODEL_NAME = "gemini-3.5-flash-lite"
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



# async def generate_interview_questions(
#     resume_text: str,
#     job_description: str = "",
#     job_role: str = "",
# ):
#     prompt = f"""
# You are an expert technical interviewer.

# Generate 10 personalized interview questions based on the candidate's
# resume and the provided job description.

# RESUME:
# {resume_text}

# JOB DESCRIPTION:
# {job_description or "Not provided. Base questions on the resume."}

# Return ONLY valid JSON in this format:
# {{
#     "questions": [
#         {{
#             "question": "Question text",
#             "category": "Technical"
#         }}
#     ]
# }}

# Rules:
# 1. Generate exactly 10 questions.
# 2. Include questions about projects, skills, and experience.
# 3. If a job description is provided, tailor questions to it.
# 4. Do not invent experience absent from the resume.
# 5. Return only valid JSON.
# """

#     for attempt in range(1, MAX_ATTEMPTS + 1):
#         try:
#             response = await asyncio.to_thread(
#                 client.models.generate_content,
#                 model=MODEL_NAME,
#                 contents=prompt,
#                 config={"response_mime_type": "application/json"},
#             )

#             if not response.text:
#                 raise ValueError("Gemini returned an empty response.")

#             result = json.loads(response.text)
#             questions = result.get("questions")

#             if (
#                 not isinstance(questions, list)
#                 or len(questions) != 10
#                 or not all(
#                     isinstance(q, dict)
#                     and isinstance(q.get("question"), str)
#                     and isinstance(q.get("category"), str)
#                     for q in questions
#                 )
#             ):
#                 raise ValueError("Invalid interview questions response.")

#             return {"questions": questions}

#         except Exception as e:
#             print(f">>> INTERVIEW ATTEMPT {attempt} FAILED: {e}")

#             if attempt == MAX_ATTEMPTS:
#                 raise RuntimeError(
#                     "Interview question generation failed. Please try again."
#                 ) from e

#             await asyncio.sleep(2 ** attempt)


async def generate_interview_questions(
    resume_text: str,
    job_description: str = "",
    job_role: str = "",
):
    if job_description.strip():
        interview_context = f"""
Interview Mode: Resume + Job Description
JOB DESCRIPTION:
{job_description.strip()}
Tailor questions to the candidate's resume and job requirements.
"""
    elif job_role.strip():
        interview_context = f"""
Interview Mode: Resume + Job Role
TARGET JOB ROLE:
{job_role.strip()}
Tailor questions to this role and the candidate's resume.
"""
    else:
        interview_context = """
Interview Mode: Resume Only
Generate questions based on the candidate's actual skills,
projects, education, and experience in the resume.
"""

    prompt = f"""
You are an expert technical interviewer preparing a candidate
for a realistic job interview.

CANDIDATE RESUME:
{resume_text}

INTERVIEW CONTEXT:
{interview_context}

Generate exactly 10 personalized interview questions.

Return ONLY valid JSON in this format:
{{
    "questions": [
        {{
            "question": "Question text",
            "category": "Technical"
        }}
    ]
}}

Rules:
1. Generate exactly 10 questions.
2. Include relevant technical, project, and experience questions.
3. Tailor the questions to the specified interview mode.
4. For job-role mode, focus on skills and expectations for that role.
5. For job-description mode, prioritize relevant JD requirements.
6. For resume-only mode, focus on the candidate's actual profile.
7. Do not invent projects, skills, or experience.
8. Use clear, interview-ready language.
9. Categories may include Technical, Projects, Behavioral,
   Experience, or Problem Solving.
10. Return only valid JSON without Markdown.
"""

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=MODEL_NAME,
                contents=prompt,
                config={"response_mime_type": "application/json"},
            )

            if not response.text:
                raise ValueError("Gemini returned an empty response.")

            result = json.loads(response.text)
            questions = result.get("questions")

            if (
                not isinstance(questions, list)
                or len(questions) != 10
                or not all(
                    isinstance(q, dict)
                    and isinstance(q.get("question"), str)
                    and q["question"].strip()
                    and isinstance(q.get("category"), str)
                    and q["category"].strip()
                    for q in questions
                )
            ):
                raise ValueError(
                    "Invalid interview questions response."
                )

            print(">>> INTERVIEW QUESTIONS GENERATED SUCCESSFULLY")
            return {"questions": questions}

        except Exception as e:
            print(
                f">>> INTERVIEW ATTEMPT {attempt} FAILED: {e}"
            )

            if attempt == MAX_ATTEMPTS:
                raise RuntimeError(
                    "Interview question generation failed. "
                    "Please try again."
                ) from e

            await asyncio.sleep(2 ** attempt)


async def evaluate_interview_answers(
    questions: list[dict],
    answers: list[str],
):
    if len(questions) != len(answers) or not questions:
        raise ValueError("Questions and answers must have matching lengths.")

    interview_data = [
        {
            "question": item["question"],
            "category": item.get("category", "General"),
            "candidate_answer": answer.strip() or "No answer provided.",
        }
        for item, answer in zip(questions, answers)
    ]

    prompt = f"""
You are an experienced technical interviewer and interview coach.

Evaluate the candidate's answers fairly and constructively.

INTERVIEW DATA:
{json.dumps(interview_data, ensure_ascii=False)}

Return ONLY valid JSON using this exact structure:
{{
    "overall_score": 0,
    "summary": "Overall performance summary",
    "strengths": ["Strength"],
    "improvements": ["Area to improve"],
    "question_feedback": [
        {{
            "question": "Original question",
            "answer": "Candidate answer",
            "score": 0,
            "feedback": "Specific feedback on the answer",
            "ideal_answer": "A strong example answer"
        }}
    ]
}}

RULES:
1. Score every answer from 0 to 10.
2. overall_score must be an integer from 0 to 100.
3. Calculate overall_score as the average question score multiplied by 10.
4. Evaluate technical correctness, relevance, clarity, and completeness.
5. For SQL or coding questions, evaluate the actual solution when provided.
6. An empty answer receives 0. An honest admission of uncertainty
   should be assessed fairly, not automatically treated as incorrect.
7. Never assume experience or projects that the candidate did not provide.
8. Keep feedback specific, actionable, and respectful.
9. Provide a relevant example answer for each question.
10. Include exactly one feedback object for each input question.
11. Return only valid JSON without Markdown.
"""

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=MODEL_NAME,
                contents=prompt,
                config={"response_mime_type": "application/json"},
            )

            if not response.text:
                raise ValueError("Gemini returned an empty response.")

            result = json.loads(response.text)
            feedback = result.get("question_feedback")

            if (
                not isinstance(result.get("overall_score"), int)
                or isinstance(result.get("overall_score"), bool)
                or not 0 <= result["overall_score"] <= 100
            ):
                raise ValueError("Invalid overall score.")

            if (
                not isinstance(feedback, list)
                or len(feedback) != len(questions)
            ):
                raise ValueError("Invalid question feedback.")

            for item in feedback:
                if (
                    not isinstance(item, dict)
                    or not isinstance(item.get("score"), int)
                    or isinstance(item.get("score"), bool)
                    or not 0 <= item["score"] <= 10
                    or not all(
                        isinstance(item.get(key), str)
                        for key in (
                            "question",
                            "answer",
                            "feedback",
                            "ideal_answer",
                        )
                    )
                ):
                    raise ValueError("Invalid feedback format.")

            if (
                not isinstance(result.get("summary"), str)
                or not isinstance(result.get("strengths"), list)
                or not isinstance(result.get("improvements"), list)
            ):
                raise ValueError("Invalid evaluation summary.")

            return result

        except Exception as e:
            print(
                f">>> EVALUATION ATTEMPT {attempt} FAILED: {e}"
            )

            if attempt == MAX_ATTEMPTS:
                raise RuntimeError(
                    "Interview evaluation failed. Please try again."
                ) from e

            await asyncio.sleep(2 ** attempt)
