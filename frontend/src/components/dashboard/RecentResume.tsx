
import { FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../common/Card/Card";

interface Resume {
  id: number;
  name: string;
  score: number;
}

interface RecentResumeProps {
  resumes: Resume[];
}

function RecentResume({ resumes }: RecentResumeProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text)" }}
        >
          Recent Resume Analysis
        </h2>

        <Link
          to="/history"
          className="flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "var(--primary)" }}
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {resumes.length === 0 ? (
        <p style={{ color: "var(--text-light)" }}>
          No resume analyses yet. Upload your first resume to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between rounded-xl border p-4 transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--primary)",
                  }}
                >
                  <FileText size={20} />
                </div>

                <div className="min-w-0">
                  <h3
                    className="break-words font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {resume.name}
                  </h3>

                  <p
                    className="text-sm"
                    style={{ color: "var(--text-light)" }}
                  >
                    ATS Analysis Completed
                  </p>
                </div>
              </div>

              <div
                className="ml-3 shrink-0 rounded-full border px-4 py-1 text-sm font-semibold"
                style={{
                  backgroundColor: "var(--success-bg)",
                  borderColor: "var(--success-border)",
                  color: "var(--accent)",
                }}
              >
                {resume.score}%
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentResume;
