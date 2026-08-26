import Card from "../common/Card/Card";

interface SkillsCardProps {
  title: string;
  skills: string[];
}

function SkillsCard({
  title,
  skills,
}: SkillsCardProps) {
  return (
    <Card className="p-6">
      <h2
        className="text-xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        {title}
      </h2>

      <div className="mt-5 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </Card>
  );
}

export default SkillsCard;