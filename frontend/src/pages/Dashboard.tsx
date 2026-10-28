
import { useEffect, useState } from "react";
import { FileText, Target, Bot } from "lucide-react";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import StatsCard from "../components/dashboard/StatsCard";
import RecentResume from "../components/dashboard/RecentResume";
import QuickActions from "../components/dashboard/QuickActions";
import {
  getResumeHistory,
  type ResumeHistoryItem,
} from "../services/resumeService";

function Dashboard() {
  const [userName] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).name ?? "" : "";
    } catch {
      return "";
    }
  });

  const [resumes, setResumes] = useState<ResumeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getResumeHistory();
        setResumes(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load resume history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const averageScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce((total, resume) => total + resume.ats_score, 0) /
            resumes.length
        )
      : 0;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Navbar isAuthenticated={true} />

      <Container>
        <div className="mt-10">
          <h1
            className="text-4xl font-bold transition-colors"
            style={{ color: "var(--text)" }}
          >
            Welcome Back{userName ? `, ${userName}` : ""} 👋
          </h1>

          <p
            className="mt-2"
            style={{ color: "var(--text-light)" }}
          >
            Manage your resumes and prepare for interviews with AI.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <StatsCard
            title="Latest 10 Resumes"
            value={loading ? "..." : String(resumes.length)}
            description="Maximum 10 recent analyses are stored"
            icon={<FileText size={28} />}
          />

          <StatsCard
            title="Average ATS Score"
            value={loading ? "..." : `${averageScore}%`}
            icon={<Target size={28} />}
          />

          <StatsCard
            title="AI Interviews"
            value="Coming Soon"
            icon={<Bot size={28} />}
          />
        </div>

        <div className="mt-10 grid gap-6 pb-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : loading ? (
              <p style={{ color: "var(--text-light)" }}>
                Loading resume history...
              </p>
            ) : (
              <RecentResume
                resumes={resumes.slice(0, 3).map((resume) => ({
                  id: resume.id,
                  name: resume.resume_filename,
                  score: resume.ats_score,
                }))}
              />
            )}
          </div>

          <QuickActions />
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
