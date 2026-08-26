import StepCard from "./StepCard";

function HowItWorks() {
  return (
    <section 
      className="py-24 transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ color: "var(--text)" }}>
          How It Works
        </h2>

        <p className="text-center mb-16 text-base" style={{ color: "var(--text-light)" }}>
          Three simple steps to improve your resume.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <StepCard
            step="1"
            title="Upload Resume"
            description="Upload your resume in PDF format."
          />

          <StepCard
            step="2"
            title="AI Analysis"
            description="Our AI analyzes your resume and compares it with the job description."
          />

          <StepCard
            step="3"
            title="Get Insights"
            description="Receive ATS score, missing skills, and interview questions."
          />
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;