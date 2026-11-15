
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Bot, Clock, LoaderCircle, ArrowRight } from "lucide-react";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import Card from "../components/common/Card/Card";
import { getResumeHistory } from "../services/resumeService";
import type { ResumeHistoryItem } from "../services/resumeService";
import {
  getInterviewHistory,
  type InterviewHistoryItem,
} from "../services/interviewService";

type HistoryTab = "resume" | "interview";

function History() {
  const navigate = useNavigate();

  // const [activeTab, setActiveTab] = useState<HistoryTab>("resume");
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<HistoryTab>(
    searchParams.get("tab") === "interview" ? "interview" : "resume"
  );
  const [resumes, setResumes] = useState<ResumeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [interviews, setInterviews] = useState<InterviewHistoryItem[]>([]);
  const [interviewLoading, setInterviewLoading] = useState(true);
  const [interviewError, setInterviewError] = useState("");

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

  useEffect(() => {
    async function loadInterviewHistory() {
      try {
        const data = await getInterviewHistory();
        setInterviews(data);
      } catch (err) {
        setInterviewError(
          err instanceof Error
            ? err.message
            : "Unable to load interview history."
        );
      } finally {
        setInterviewLoading(false);
      }
    }

    loadInterviewHistory();
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Navbar isAuthenticated={true} />

      <Container>
        <div className="py-10">
          <div className="mb-8">
            <h1
              className="text-3xl font-bold md:text-4xl"
              style={{ color: "var(--text)" }}
            >
              History
            </h1>
            <p
              className="mt-2"
              style={{ color: "var(--text-light)" }}
            >
              View your previous resume analyses and interview sessions.{" "}
              <span className="italic text-sm">
                (Stores a maximum of 10 recent resume analyses and interview sessions.)
              </span>
            </p>
          </div>

          <div
            className="mb-8 flex gap-2 rounded-xl border p-2"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <button
              onClick={() => setActiveTab("resume")}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition"
              style={{
                backgroundColor:
                  activeTab === "resume" ? "var(--primary)" : "transparent",
                color: activeTab === "resume" ? "#ffffff" : "var(--text)",
              }}
            >
              <FileText size={18} />
              Resume History
            </button>

            <button
              onClick={() => setActiveTab("interview")}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition"
              style={{
                backgroundColor:
                  activeTab === "interview" ? "var(--primary)" : "transparent",
                color: activeTab === "interview" ? "#ffffff" : "var(--text)",
              }}
            >
              <Bot size={18} />
              Interview History
            </button>
          </div>

          {activeTab === "resume" && (
            <Card className="p-6">
              <h2
                className="mb-6 text-xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Resume Analysis History
              </h2>

              {loading ? (
                <div
                  className="flex items-center justify-center gap-2 py-12"
                  style={{ color: "var(--text-light)" }}
                >
                  <LoaderCircle size={20} className="animate-spin" />
                  Loading resume history...
                </div>
              ) : error ? (
                <p className="py-8 text-center text-red-500">{error}</p>
              ) : resumes.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText
                    size={40}
                    className="mx-auto mb-3"
                    style={{ color: "var(--primary)" }}
                  />
                  <p className="font-semibold" style={{ color: "var(--text)" }}>
                    No resume history yet
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-light)" }}>
                    Upload a resume to see your analysis history here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume) => (
                    <button
                      key={resume.id}
                      type="button"
                      onClick={() => navigate(`/results/${resume.id}`)}
                      className="flex w-full cursor-pointer flex-col justify-between gap-4 rounded-xl border p-4 text-left transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-600 sm:flex-row sm:items-center"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className="rounded-xl p-3"
                          style={{
                            backgroundColor: "var(--secondary)",
                            color: "var(--primary)",
                          }}
                        >
                          <FileText size={22} />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="break-words font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {resume.resume_filename}
                          </h3>
                          <p
                            className="mt-1 flex items-center gap-1 text-sm"
                            style={{ color: "var(--text-light)" }}
                          >
                            <Clock size={14} />
                            {new Date(resume.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:justify-end">
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-light)" }}
                        >
                          ATS Score
                        </span>
                        <span
                          className="rounded-full border px-4 py-1 text-sm font-semibold"
                          style={{
                            backgroundColor: "var(--success-bg)",
                            borderColor: "var(--success-border)",
                            color: "var(--accent)",
                          }}
                        >
                          {resume.ats_score}%
                        </span>
                        <ArrowRight
                          size={18}
                          style={{ color: "var(--primary)" }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* {activeTab === "interview" && (
            <Card className="p-6">
              <div className="py-12 text-center">
                <Bot
                  size={44}
                  className="mx-auto mb-4"
                  style={{ color: "var(--primary)" }}
                />
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  No interview history yet
                </h2>
                <p
                  className="mx-auto mt-2 max-w-md"
                  style={{ color: "var(--text-light)" }}
                >
                  Your completed AI interview sessions will appear here once
                  the Interview Assistant is implemented.
                </p>
              </div>
            </Card>
          )} */}

          {activeTab === "interview" && (
            <Card className="p-6">
              <h2
                className="mb-6 text-xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Interview Session History
              </h2>

              {interviewLoading ? (
                <div
                  className="flex items-center justify-center gap-2 py-12"
                  style={{ color: "var(--text-light)" }}
                >
                  <LoaderCircle size={20} className="animate-spin" />
                  Loading interview history...
                </div>
              ) : interviewError ? (
                <p className="py-8 text-center text-red-500">{interviewError}</p>
              ) : interviews.length === 0 ? (
                <div className="py-12 text-center">
                  <Bot
                    size={44}
                    className="mx-auto mb-4"
                    style={{ color: "var(--primary)" }}
                  />
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    No interview history yet
                  </h2>
                  <p
                    className="mx-auto mt-2 max-w-md"
                    style={{ color: "var(--text-light)" }}
                  >
                    Your completed AI interview sessions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <button
                      key={interview.id}
                      type="button"
                      onClick={() =>
                        navigate(`/interview/history/${interview.id}`)
                      }
                      className="flex w-full flex-col justify-between gap-4 rounded-xl border p-4 text-left transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-600 sm:flex-row sm:items-center"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className="rounded-xl p-3"
                          style={{
                            backgroundColor: "var(--secondary)",
                            color: "var(--primary)",
                          }}
                        >
                          <Bot size={22} />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="break-words font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {interview.resume_filename}
                          </h3>

                          <p
                            className="mt-1 text-sm"
                            style={{ color: "var(--text-light)" }}
                          >
                            {interview.interview_mode
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
                            {" · "}
                            {interview.job_role || "No specific job role"}
                          </p>

                          <p
                            className="mt-1 flex items-center gap-1 text-sm"
                            style={{ color: "var(--text-light)" }}
                          >
                            <Clock size={14} />
                            {new Date(interview.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:justify-end">
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-light)" }}
                        >
                          Overall Score
                        </span>

                        <span
                          className="rounded-full border px-4 py-1 text-sm font-semibold"
                          style={{
                            backgroundColor: "var(--success-bg)",
                            borderColor: "var(--success-border)",
                            color: "var(--accent)",
                          }}
                        >
                          {interview.overall_score}%
                        </span>

                        <ArrowRight
                          size={18}
                          style={{ color: "var(--primary)" }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}

export default History;
