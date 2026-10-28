
import API from "./api";
import type { Analysis } from "../types/analysis";

export interface ResumeHistoryItem {
  id: number;
  resume_filename: string;
  analysis_mode: string;
  job_role: string | null;
  job_description: string | null;
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
  recommended_roles: string[];
  created_at: string;
}

export interface SavedAnalysis extends Analysis {
  id: number;
  resume_filename: string;
  analysis_mode: string;
  job_role: string | null;
  job_description: string | null;
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

export async function uploadResume(
  file: File,
  jobDescription: string,
  analysisMode = "ats"
): Promise<SavedAnalysis> {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append("analysis_mode", analysisMode);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API}/resume/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(
      result?.detail ?? `Resume analysis failed: ${response.status}`
    );
  }

  return response.json();
}

export async function getResumeHistory(): Promise<ResumeHistoryItem[]> {
  const response = await fetch(`${API}/resume/history`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch resume history: ${response.status}`);
  }

  return response.json();
}

export async function getResumeAnalysis(
  analysisId: number
): Promise<ResumeHistoryItem> {
  const response = await fetch(
    `${API}/resume/history/${analysisId}`,
    { headers: getAuthHeaders() }
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(
      result?.detail ?? `Unable to load resume analysis: ${response.status}`
    );
  }

  return response.json();
}



export async function getSavedResumeFile(analysisId: number): Promise<Blob> {
  const response = await fetch(
    `${API}/resume/history/${analysisId}/file`,
    {
      headers: getAuthHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(
      result?.detail ?? "Unable to open the saved resume."
    );
  }

  return response.blob();
}

