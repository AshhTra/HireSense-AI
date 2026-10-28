
import type { ReactNode } from "react";
import Card from "../common/Card/Card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description?: string;
}

function StatsCard({
  title,
  value,
  icon,
  description,
}: StatsCardProps) {
  return (
    <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-light)" }}
          >
            {title}
          </p>

          <h2
            className="mt-2 text-3xl font-bold"
            style={{ color: "var(--text)" }}
          >
            {value}
          </h2>

          {description && (
            <p
              className="mt-2 text-xs italic"
              style={{ color: "var(--text-light)" }}
            >
              {description}
            </p>
          )}
        </div>

        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundColor: "var(--secondary)",
            borderColor: "var(--border)",
            color: "var(--primary)",
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default StatsCard;
