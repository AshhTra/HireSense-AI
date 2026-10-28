
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";

import ScoreCard from "../components/results/ScoreCard";
import SkillsCard from "../components/results/SkillsCard";
import SuggestionCard from "../components/results/SuggestionCard";
import RecommendedRoles from "../components/results/RecommendedRoles";

import {
  getResumeAnalysis,
  getSavedResumeFile,
} from "../services/resumeService";

import type { Analysis } from "../types/analysis";
import type { ResumeHistoryItem } from "../services/resumeService";

function Results() {
  const { analysisId } = useParams<{ analysisId: string }>();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [savedDetails, setSavedDetails] =
    useState<ResumeHistoryItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      setLoading(true);
      setError("");
      setAnalysis(null);
      setSavedDetails(null);

      if (analysisId) {
        const id = Number(analysisId);

        if (!Number.isInteger(id) || id <= 0) {
          setError("Invalid resume analysis ID.");
          setLoading(false);
          return;
        }

        try {
          const saved = await getResumeAnalysis(id);

          if (!cancelled) {
            setSavedDetails(saved);
            setAnalysis({
              ats_score: saved.ats_score,
              matched_skills: saved.matched_skills,
              missing_skills: saved.missing_skills,
              suggestions: saved.suggestions,
              recommended_roles: saved.recommended_roles,
            });
          }
        } catch (err) {
          if (!cancelled) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load this resume analysis."
            );
          }
        } finally {
          if (!cancelled) setLoading(false);
        }

        return;
      }

      try {
        const storedAnalysis = sessionStorage.getItem("resumeAnalysis");

        if (!storedAnalysis) {
          if (!cancelled) {
            setError("Please upload your resume and analyze it first.");
          }
        } else {
          const parsed: Analysis = JSON.parse(storedAnalysis);

          if (!cancelled) setAnalysis(parsed);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to read the saved analysis.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  async function handleViewResume() {
    if (!analysisId || fileLoading) return;

    // Open the tab immediately so the browser doesn't block the popup.
    const newTab = window.open("about:blank", "_blank");

    if (!newTab) {
      setFileError("Please allow pop-ups to view your resume.");
      return;
    }

    newTab.opener = null;
    newTab.document.title = "Loading resume...";

    setFileLoading(true);
    setFileError("");

    try {
      const pdfBlob = await getSavedResumeFile(Number(analysisId));

      if (pdfBlob.size === 0) {
        throw new Error("The saved PDF is empty.");
      }

      const pdfUrl = URL.createObjectURL(pdfBlob);
      newTab.location.href = pdfUrl;

      // Release the temporary browser URL after the PDF has had time to load.
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
    } catch (err) {
      newTab.close();

      setFileError(
        err instanceof Error
          ? err.message
          : "Unable to open the saved resume."
      );
    } finally {
      setFileLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen pb-16 transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Navbar isAuthenticated />

      <Container>
        <div className="py-10">
          {loading ? (
            <div
              className="py-20 text-center"
              style={{ color: "var(--text-light)" }}
            >
              Loading resume analysis...
            </div>
          ) : error || !analysis ? (
            <div className="py-20 text-center">
              <h1
                className="text-3xl font-bold"
                style={{ color: "var(--text)" }}
              >
                {error === "Resume analysis not found."
                  ? "Analysis Not Found"
                  : "Unable to Display Analysis"}
              </h1>

              <p className="mt-3" style={{ color: "var(--text-light)" }}>
                {error || "No analysis data is available."}
              </p>
            </div>
          ) : (
            <>
              <h1
                className="text-4xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Resume Analysis
              </h1>

              <p
                className="mt-2"
                style={{ color: "var(--text-light)" }}
              >
                Here's your AI-powered analysis report.
              </p>

              {savedDetails && (
                <section
                  className="mt-8 rounded-2xl border p-6"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Analysis Details
                  </h2>

                  <div className="mt-4 space-y-3">
                    <p style={{ color: "var(--text-light)" }}>
                      <strong style={{ color: "var(--text)" }}>
                        Resume:
                      </strong>{" "}
                      {savedDetails.resume_filename}
                    </p>

                    <p style={{ color: "var(--text-light)" }}>
                      <strong style={{ color: "var(--text)" }}>
                        Analysis Mode:
                      </strong>{" "}
                      {savedDetails.analysis_mode}
                    </p>

                    {savedDetails.job_role && (
                      <p style={{ color: "var(--text-light)" }}>
                        <strong style={{ color: "var(--text)" }}>
                          Job Role:
                        </strong>{" "}
                        {savedDetails.job_role}
                      </p>
                    )}

                    {savedDetails.job_description && (
                      <div>
                        <h3
                          className="font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          Job Description
                        </h3>
                        <p
                          className="mt-2 whitespace-pre-wrap break-words"
                          style={{ color: "var(--text-light)" }}
                        >
                          {savedDetails.job_description}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleViewResume}
                    disabled={fileLoading}
                    className="mt-5 rounded-lg px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {fileLoading ? "Opening Resume..." : "View Resume"}
                  </button>

                  {fileError && (
                    <p className="mt-3 text-sm text-red-500" role="alert">
                      {fileError}
                    </p>
                  )}
                </section>
              )}

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

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <SkillsCard
                  title="Skills Found"
                  skills={analysis.matched_skills}
                />

                <SkillsCard
                  title="Missing Skills"
                  skills={analysis.missing_skills}
                />
              </div>

              <div className="mt-8">
                <SuggestionCard suggestions={analysis.suggestions} />
              </div>

              <div className="mt-8">
                <RecommendedRoles
                  roles={analysis.recommended_roles.map((role) => ({
                    role,
                    score: analysis.ats_score,
                  }))}
                />
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Results;
