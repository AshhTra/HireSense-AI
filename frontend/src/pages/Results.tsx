import { useState } from "react";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";

import ScoreCard from "../components/results/ScoreCard";
import SkillsCard from "../components/results/SkillsCard";
import SuggestionCard from "../components/results/SuggestionCard";
import RecommendedRoles from "../components/results/RecommendedRoles";

import type { Analysis } from "../types/analysis";

function Results() {
  const [analysis] = useState<Analysis | null>(() => {
    const storedAnalysis = sessionStorage.getItem("resumeAnalysis");

    if (!storedAnalysis) {
      return null;
    }

    try {
      const parsedAnalysis: Analysis = JSON.parse(storedAnalysis);

      console.log("STORED AI ANALYSIS:", parsedAnalysis);

      return parsedAnalysis;
    } catch (error) {
      console.error("Failed to parse analysis:", error);
      return null;
    }
  });

  if (!analysis) {
    return (
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: "var(--background)",
        }}
      >
        <Navbar isAuthenticated />

        <Container>
          <div className="py-20 text-center">
            <h1
              className="text-3xl font-bold"
              style={{
                color: "var(--text)",
              }}
            >
              No Analysis Found
            </h1>

            <p
              className="mt-3"
              style={{
                color: "var(--text-light)",
              }}
            >
              Please upload your resume and analyze it first.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const skillsFound = analysis.matched_skills;

  const missingSkills = analysis.missing_skills;

  const suggestions = analysis.suggestions;

  const roles = analysis.recommended_roles.map((role) => ({
    role,
    score: analysis.ats_score,
  }));

  return (
    <div
      className="min-h-screen pb-16 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
      }}
    >
      <Navbar isAuthenticated />

      <Container>
        <div className="py-10">
          <h1
            className="text-4xl font-bold"
            style={{
              color: "var(--text)",
            }}
          >
            Resume Analysis
          </h1>

          <p
            className="mt-2"
            style={{
              color: "var(--text-light)",
            }}
          >
            Here's your AI-powered analysis report.
          </p>

          {/* Scores */}

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <ScoreCard
              title="ATS Score"
              value={`${analysis.ats_score}%`}
            />

            <ScoreCard
              title="Resume Match"
              value={`${analysis.ats_score}%`}
              color="var(--success)"
            />
          </div>

          {/* Skills */}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <SkillsCard
              title="Skills Found"
              skills={skillsFound}
            />

            <SkillsCard
              title="Missing Skills"
              skills={missingSkills}
            />
          </div>

          {/* Suggestions */}

          <div className="mt-8">
            <SuggestionCard
              suggestions={suggestions}
            />
          </div>

          {/* Recommended Roles */}

          <div className="mt-8">
            <RecommendedRoles
              roles={roles}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Results;