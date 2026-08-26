import type { ChangeEvent } from "react";

import Card from "../common/Card/Card";

interface JobDescriptionProps {
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
}

function JobDescription({
  jobDescription,
  setJobDescription,
}: JobDescriptionProps) {
  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(event.target.value);
  };

  return (
    <Card className="p-6">
      <h2
        className="mb-5 text-xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        Job Description
      </h2>

      <textarea
        rows={12}
        value={jobDescription}
        onChange={handleChange}
        placeholder="Paste the Job Description here..."
        className="w-full rounded-xl border p-4 outline-none transition-all duration-300"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      />
    </Card>
  );
}

export default JobDescription;