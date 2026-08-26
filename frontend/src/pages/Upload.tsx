import { useNavigate } from "react-router-dom";
import { Target, Briefcase, Sparkles } from "lucide-react";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import AnalysisModeCard from "../components/upload/AnalysisModeCard";

function Upload() {
  const navigate = useNavigate();

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
            AI Resume Analysis
          </h1>

          <p
            className="mt-3"
            style={{
              color: "var(--text-light)",
            }}
          >
            Choose how you want HireSense AI to analyze your resume.
          </p>

          <div className="mt-10 grid gap-6">
            <AnalysisModeCard
              icon={<Target size={28} />}
              title="ATS Analysis"
              description="Upload Resume + Job Description"
              active={false}
              onClick={() => navigate("/resume-analysis/upload")}
            />

            <AnalysisModeCard
              icon={<Briefcase size={28} />}
              title="Role Match Analysis"
              description="Coming Soon"
              active={false}
              onClick={() => navigate("/coming-soon")}
            />

            <AnalysisModeCard
              icon={<Sparkles size={28} />}
              title="Career Recommendation"
              description="Coming Soon"
              active={false}
              onClick={() => navigate("/coming-soon")}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Upload;