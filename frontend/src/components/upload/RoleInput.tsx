import { Briefcase } from "lucide-react";
import Card from "../common/Card/Card";

interface RoleInputProps {
  role: string;
  setRole: (value: string) => void;
}

function RoleInput({ role, setRole }: RoleInputProps) {
  return (
    <Card className="p-6">
      <h2
        className="mb-5 text-xl font-bold"
        style={{ color: "var(--text)" }}
      >
        Target Job Role
      </h2>

      <div className="relative">
        <Briefcase
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-light)" }}
        />

        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Example: Software Engineer"
          className="w-full rounded-2xl border py-3.5 pl-12 pr-4 outline-none transition-all duration-300"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        />
      </div>

      <p
        className="mt-4 text-xs leading-relaxed"
        style={{ color: "var(--text-light)" }}
      >
        Examples: Software Engineer, Frontend Developer, Backend Developer,
        Data Analyst, Machine Learning Engineer.
      </p>
    </Card>
  );
}

export default RoleInput;