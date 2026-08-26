import Card from "../common/Card/Card";

interface SuggestionCardProps {
  suggestions: string[];
}

function SuggestionCard({
  suggestions,
}: SuggestionCardProps) {
  return (
    <Card className="p-6">
      <h2
        className="text-xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        AI Suggestions
      </h2>

      <ul
        className="mt-5 list-disc space-y-3 pl-5"
        style={{ color: "var(--text-light)" }}
      >
        {suggestions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}

export default SuggestionCard;