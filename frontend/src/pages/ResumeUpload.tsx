
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import UploadBox from "../components/upload/UploadBox";
import JobDescription from "../components/upload/JobDescription";
import Button from "../components/common/Button/Button";

import { uploadResume } from "../services/resumeService";

const MIN_DESCRIPTION_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB

function ResumeUpload() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const descriptionLength = jobDescription.trim().length;

  const handleAnalyze = async () => {
    setError("");

    if (!file) {
      setError("Please upload your resume.");
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setError("Resume PDF must be 5 MB or smaller.");
      return;
    }

    if (descriptionLength < MIN_DESCRIPTION_LENGTH) {
      setError("Job description must contain at least 100 characters.");
      return;
    }

    if (descriptionLength > MAX_DESCRIPTION_LENGTH) {
      setError("Job description cannot exceed 5,000 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await uploadResume(
        file,
        jobDescription.trim(),
        "ats"
      );

      sessionStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(response)
      );

      navigate(`/results/${response.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pb-20 transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Navbar isAuthenticated />

      <Container>
        <div className="py-10">
          <h1
            className="text-3xl font-bold md:text-4xl"
            style={{ color: "var(--text)" }}
          >
            ATS Resume Analysis
          </h1>

          <p
            className="mt-3"
            style={{ color: "var(--text-light)" }}
          >
            Upload your resume and paste the job description to get an
            AI-powered analysis.
          </p>

          <div className="mt-10">
            <UploadBox file={file} setFile={setFile} />
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--text-light)" }}
            >
              Maximum file size: 5 MB (PDF only).
            </p>
          </div>

          <div className="mt-8">
            <JobDescription
              jobDescription={jobDescription}
              setJobDescription={(value) => {
                setJobDescription(value);
                setError("");
              }}
            />

            <p
              className="mt-2 text-sm"
              style={{ color: "var(--text-light)" }}
            >
              {descriptionLength.toLocaleString()} / 5,000 characters
              (minimum 100)
            </p>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="cursor-pointer border-0 bg-linear-to-r from-[#0F766E] to-[#10B981] px-8 py-3 text-white"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ResumeUpload;
