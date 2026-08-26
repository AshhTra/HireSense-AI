import { useState } from "react";
import { FileText, Target, Bot } from "lucide-react";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import StatsCard from "../components/dashboard/StatsCard";
import RecentResume from "../components/dashboard/RecentResume";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
    const [userName] = useState(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      return "";
    }

    return JSON.parse(user).name;
  });

  const resumes = [
    {
      id: 1,
      name: "Software Engineer Resume",
      score: 91,
    },
    {
      id: 2,
      name: "Frontend Developer Resume",
      score: 87,
    },
    {
      id: 3,
      name: "Data Scientist Resume",
      score: 84,
    },
  ];

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
            className="mt-2 transition-colors"
            style={{ color: "var(--text-light)" }}
          >
            Manage your resumes and prepare for interviews with AI.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <StatsCard
            title="Total Resumes"
            value="5"
            icon={<FileText size={28} />}
          />

          <StatsCard
            title="Average ATS Score"
            value="84%"
            icon={<Target size={28} />}
          />

          <StatsCard
            title="AI Interviews"
            value="3"
            icon={<Bot size={28} />}
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 pb-16">
          <div className="lg:col-span-2">
            <RecentResume resumes={resumes} />
          </div>

          <QuickActions />
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;