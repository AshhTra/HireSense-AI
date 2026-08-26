import type { ReactNode } from "react";
import Card from "../common/Card/Card";

interface AnalysisModeCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

function AnalysisModeCard({
  icon,
  title,
  description,
  active,
  onClick,
}: AnalysisModeCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer text-left outline-none"
    >
      <Card
        className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        style={{
          backgroundColor: active ? "var(--secondary)" : "var(--surface)",
          borderColor: active ? "var(--primary)" : "var(--border)",
        }}
      >
        <div className="flex items-center gap-5">
          <div
            className="rounded-2xl p-4 transition-all duration-300"
            style={{
              background: active
                ? "linear-gradient(135deg, var(--primary), var(--accent))"
                : "var(--secondary)",
              color: active ? "#ffffff" : "var(--primary)",
            }}
          >
            {icon}
          </div>

          <div>
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--text)" }}
            >
              {title}
            </h3>

            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-light)" }}
            >
              {description}
            </p>
          </div>
        </div>
      </Card>
    </button>
  );
}

export default AnalysisModeCard;