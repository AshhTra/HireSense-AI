import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import UploadBox from "../components/upload/UploadBox";
import JobDescription from "../components/upload/JobDescription";
import Button from "../components/common/Button/Button";

import { uploadResume } from "../services/resumeService";
// import { uploadResume } from "../services/authService";

function ResumeUpload() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload your resume.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    try {
      setLoading(true);

      const response = await uploadResume(file, jobDescription);

      console.log("AI ANALYSIS:", response);

      // Save AI result for Results page
      sessionStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(response)
      );

      navigate("/results");
    } catch (error) {
      console.error("Resume analysis error:", error);
      alert("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pb-20 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
      }}
    >
      <Navbar isAuthenticated />

      <Container>
        <div className="py-10">
          <h1
            className="text-3xl font-bold md:text-4xl"
            style={{
              color: "var(--text)",
            }}
          >
            ATS Resume Analysis
          </h1>

          <p
            className="mt-3"
            style={{
              color: "var(--text-light)",
            }}
          >
            Upload your resume and paste the job description to get an AI-powered analysis.
          </p>

          <div className="mt-10">
            <UploadBox
              file={file}
              setFile={setFile}
            />
          </div>

          <div className="mt-8">
            <JobDescription
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-linear-to-r from-[#0F766E] to-[#10B981] border-0 px-8 py-3 text-white cursor-pointer"
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