import Card from "../common/Card/Card";

interface Role {
  role: string;
  score: number;
}

interface RecommendedRolesProps {
  roles: Role[];
}

function RecommendedRoles({ roles }: RecommendedRolesProps) {
  return (
    <Card className="p-6">
      <h2
        className="text-xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        Recommended Roles
      </h2>

      <div className="mt-5 space-y-4">
        {roles.map((role) => (
          <div
            key={role.role}
            className="flex items-center justify-between rounded-xl border p-4 transition-all duration-300 hover:shadow-md"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--text)" }}
            >
              {role.role}
            </span>

            <span
              className="rounded-full border px-4 py-1 text-sm font-semibold"
              style={{
                backgroundColor: "var(--success-bg)",
                borderColor: "var(--success-border)",
                color: "var(--accent)",
              }}
            >
              {role.score}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecommendedRoles;