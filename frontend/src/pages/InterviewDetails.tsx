
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Bot,
  Clock,
  LoaderCircle,
  ExternalLink,
} from "lucide-react";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import Card from "../components/common/Card/Card";

import {
  getInterviewDetails,
  getInterviewResume,
  type InterviewDetails as InterviewDetailsType,
} from "../services/interviewService";

function InterviewDetails() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] =
    useState<InterviewDetailsType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      try {
        if (!interviewId || isNaN(Number(interviewId))) {
          throw new Error("Invalid interview ID.");
        }

        const data = await getInterviewDetails(Number(interviewId));
        setInterview(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load interview details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [interviewId]);

  const handleViewResume = async () => {
    if (!interview) return;

    // Open a blank tab immediately to avoid popup blockers.
    const newTab = window.open("", "_blank");

    if (!newTab) {
      setError("Please allow pop-ups to view your resume.");
      return;
    }

    try {
      setResumeLoading(true);

      const blob = await getInterviewResume(interview.id);
      const url = URL.createObjectURL(blob);

      newTab.location.href = url;

      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      newTab.close();

      setError(
        err instanceof Error
          ? err.message
          : "Unable to open resume PDF."
      );
    } finally {
      setResumeLoading(false);
    }
  };

  const formatMode = (mode: string) =>
    mode
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Navbar isAuthenticated={true} />
        <Container>
          <div
            className="flex items-center justify-center gap-2 py-24"
            style={{ color: "var(--text-light)" }}
          >
            <LoaderCircle className="animate-spin" size={22} />
            Loading interview details...
          </div>
        </Container>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Navbar isAuthenticated={true} />
        <Container>
          <div className="py-16 text-center">
            <p className="mb-5 text-red-500">{error}</p>
            <button
              onClick={() => navigate("/history?tab=interview")}
              className="rounded-lg px-5 py-2 font-semibold text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Back to History
            </button>
          </div>
        </Container>
      </div>
    );
  }

  if (!interview) return null;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Navbar isAuthenticated={true} />

      <Container>
        <div className="py-10">
          <button
            onClick={() => navigate("/history?tab=interview")}
            className="mb-6 flex items-center gap-2 font-medium transition hover:opacity-75"
            style={{ color: "var(--primary)" }}
          >
            <ArrowLeft size={18} />
            Back to History
          </button>

          <div className="mb-8">
            <h1
              className="text-3xl font-bold md:text-4xl"
              style={{ color: "var(--text)" }}
            >
              Interview Details
            </h1>
            <p
              className="mt-2"
              style={{ color: "var(--text-light)" }}
            >
              Review your previous AI interview performance.
            </p>
          </div>

          {error && (
            <p className="mb-5 text-sm text-red-500">{error}</p>
          )}

          {/* Interview Information */}
          <Card className="mb-6 p-6">
            <h2
              className="mb-5 flex items-center gap-2 text-xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              <Bot size={21} style={{ color: "var(--primary)" }} />
              Interview Information
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-sm" style={{ color: "var(--text-light)" }}>
                  Interview ID
                </p>
                <p className="mt-1 font-semibold" style={{ color: "var(--text)" }}>
                  #{interview.id}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm" style={{ color: "var(--text-light)" }}>
                  Resume
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex items-center gap-2 font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    <FileText size={19} style={{ color: "var(--primary)" }} />
                    {interview.resume_filename}
                  </div>

                  <button
                    onClick={handleViewResume}
                    disabled={resumeLoading}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {resumeLoading ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <ExternalLink size={16} />
                    )}
                    View Resume
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm" style={{ color: "var(--text-light)" }}>
                  Interview Mode
                </p>
                <p className="mt-1 font-medium" style={{ color: "var(--text)" }}>
                  {formatMode(interview.interview_mode)}
                </p>
              </div>

              <div>
                <p className="text-sm" style={{ color: "var(--text-light)" }}>
                  Job Details
                </p>
                <p
                  className="mt-1 whitespace-pre-wrap font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {interview.job_role ||
                    interview.job_description ||
                    "Not applicable"}
                </p>
              </div>

              <div>
                <p className="text-sm" style={{ color: "var(--text-light)" }}>
                  Created At
                </p>
                <p
                  className="mt-1 flex items-center gap-2 font-medium"
                  style={{ color: "var(--text)" }}
                >
                  <Clock size={16} />
                  {new Date(interview.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Overall Score */}
          <Card className="mb-6 p-6">
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              Overall Score
            </h2>

            <div className="flex items-center gap-4">
              <span
                className="text-4xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {interview.overall_score}%
              </span>

              <div className="h-3 flex-1 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, interview.overall_score)
                    )}%`,
                    backgroundColor: "var(--primary)",
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Question-wise Feedback */}
          <Card className="mb-6 p-6">
            <h2
              className="mb-6 text-xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              Question-wise Feedback
            </h2>

            {interview.question_feedback?.length ? (
              <div className="space-y-5">
                {interview.question_feedback.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border p-5"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <h3
                        className="font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        Question {index + 1}: {item.question}
                      </h3>

                      <span
                        className="shrink-0 rounded-full border px-3 py-1 text-sm font-semibold"
                        style={{
                          backgroundColor: "var(--success-bg)",
                          borderColor: "var(--success-border)",
                          color: "var(--accent)",
                        }}
                      >
                        {item.score}/10
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p
                          className="mb-1 text-sm font-semibold"
                          style={{ color: "var(--text-light)" }}
                        >
                          Your Answer
                        </p>
                        <p
                          className="whitespace-pre-wrap"
                          style={{ color: "var(--text)" }}
                        >
                          {item.answer || "No answer provided."}
                        </p>
                      </div>

                      <div>
                        <p
                          className="mb-1 text-sm font-semibold"
                          style={{ color: "var(--text-light)" }}
                        >
                          Feedback
                        </p>
                        <p
                          className="whitespace-pre-wrap"
                          style={{ color: "var(--text)" }}
                        >
                          {item.feedback}
                        </p>
                      </div>

                      <div>
                        <p
                          className="mb-1 text-sm font-semibold"
                          style={{ color: "var(--text-light)" }}
                        >
                          Ideal Answer
                        </p>
                        <p
                          className="whitespace-pre-wrap"
                          style={{ color: "var(--text)" }}
                        >
                          {item.ideal_answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-light)" }}>
                No question-wise feedback available.
              </p>
            )}
          </Card>

          {/* Summary */}
          <Card className="mb-6 p-6">
            <h2
              className="mb-3 text-xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              Summary
            </h2>
            <p
              className="whitespace-pre-wrap leading-relaxed"
              style={{ color: "var(--text-light)" }}
            >
              {interview.summary || "No summary available."}
            </p>
          </Card>

          {/* Strengths */}
          <Card className="mb-6 p-6">
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              Overall Strengths
            </h2>

            {interview.strengths?.length ? (
              <ul className="list-inside list-disc space-y-2">
                {interview.strengths.map((strength, index) => (
                  <li key={index} style={{ color: "var(--text-light)" }}>
                    {strength}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "var(--text-light)" }}>
                No strengths available.
              </p>
            )}
          </Card>

          {/* Improvements */}
          <Card className="mb-6 p-6">
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              Overall Improvements
            </h2>

            {interview.improvements?.length ? (
              <ul className="list-inside list-disc space-y-2">
                {interview.improvements.map((improvement, index) => (
                  <li key={index} style={{ color: "var(--text-light)" }}>
                    {improvement}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "var(--text-light)" }}>
                No improvements available.
              </p>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default InterviewDetails;

