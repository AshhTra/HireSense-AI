import API from "./api";
import type { Analysis } from "../types/analysis";

export async function uploadResume(
  file: File,
  jobDescription: string
): Promise<Analysis> {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API}/resume/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Resume analysis failed: ${response.status}`);
  }

  const data: Analysis = await response.json();

  return data;
}