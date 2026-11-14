
import { useNavigate } from "react-router-dom";
import { FileText, BriefcaseBusiness, UserRound } from "lucide-react";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import AnalysisModeCard from "../components/upload/AnalysisModeCard";

function Interview() {
  const navigate = useNavigate();

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
            AI Interview Preparation
          </h1>

          <p
            className="mt-3"
            style={{ color: "var(--text-light)" }}
          >
            Choose how you want HireSense AI to prepare your interview.
          </p>

          <div className="mt-10 grid gap-6">
            <AnalysisModeCard
              icon={<FileText size={28} />}
              title="Resume + Job Description"
              description="Generate interview questions based on your resume and the job description."
              active={true}
              onClick={() => navigate("/interview/job-description")}
            />

            <AnalysisModeCard
              icon={<BriefcaseBusiness size={28} />}
              title="Resume + Job Role"
              description="Prepare for interviews tailored to a specific job role."
              active={true}
              onClick={() => navigate("/interview/role")}
            />

            <AnalysisModeCard
              icon={<UserRound size={28} />}
              title="Resume Only"
              description="Generate questions based on your skills, projects, and experience."
              active={true}
              onClick={() => navigate("/interview/resume-only")}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Interview;
