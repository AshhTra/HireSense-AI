import { FileText, ArrowRight } from "lucide-react";
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

        <button
          className="flex cursor-pointer items-center gap-2 text-sm font-medium transition hover:underline"
          style={{ color: "var(--primary)" }}
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

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

              <div>
                <h3
                  className="font-medium"
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
              className="rounded-full border px-4 py-1 text-sm font-semibold"
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
    </Card>
  );
}

export default RecentResume;