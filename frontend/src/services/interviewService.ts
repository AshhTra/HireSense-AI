
import API from "./api";

export interface InterviewQuestion {
  question: string;
  category: string;
}

export interface InterviewResponse {
  mode: string;
  session_id: string;
  resume_filename: string;
  job_role: string | null;
  job_description: string | null;
  questions: InterviewQuestion[];
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in again. Authentication token not found.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function generateInterview(
  file: File,
  mode: string,
  jobDescription = "",
  jobRole = ""
): Promise<InterviewResponse> {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append("mode", mode);
  formData.append("job_description", jobDescription);
  formData.append("job_role", jobRole);

  const response = await fetch(`${API}/interview/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.detail ?? `Interview generation failed: ${response.status}`
    );
  }

  return response.json();
}


export interface InterviewEvaluation {
  overall_score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  question_feedback: {
    question: string;
    answer: string;
    score: number;
    feedback: string;
    ideal_answer: string;
  }[];
}

// export async function evaluateInterview(
//   sessionId: string,
//   questions: {
//     question: string;
//     category: string;
//     answer: string;
//   }[]
// ): Promise<InterviewEvaluation> {
//   const response = await fetch(`${API}/interview/evaluate`, {
//     method: "POST",
//     headers: {
//       ...getAuthHeaders(),
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ questions }),
//   });

//   if (!response.ok) {
//     const result = await response.json().catch(() => null);
//     throw new Error(
//       result?.detail ?? `Evaluation failed: ${response.status}`
//     );
//   }

//   return response.json();
// }

export async function evaluateInterview(
  sessionId: string,
  questions: {
    question: string;
    category: string;
    answer: string;
  }[]
): Promise<InterviewEvaluation> {
  const response = await fetch(`${API}/interview/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
      questions,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to evaluate interview");
  }

  return response.json();
}

