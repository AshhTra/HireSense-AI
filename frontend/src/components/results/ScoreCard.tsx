import Card from "../common/Card/Card";

interface ScoreCardProps {
  title: string;
  value: string;
  color?: string;
}

function ScoreCard({
  title,
  value,
  color,
}: ScoreCardProps) {
  return (
    <Card className="p-6">
      <p
        className="text-sm font-medium"
        style={{ color: "var(--text-light)" }}
      >
        {title}
      </p>

      <h2
        className="mt-3 text-4xl font-bold"
        style={{
          color: color ?? "var(--primary)",
        }}
      >
        {value}
      </h2>
    </Card>
  );
}

export default ScoreCard;