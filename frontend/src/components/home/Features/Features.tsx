import { FileText, Target, Bot, MessageSquare } from "lucide-react";
import FeatureCard from "./FeatureCard";

const featuresData = [
  {
    icon: FileText,
    title: "Resume Parsing",
    description: "Extract skills, education and experience automatically.",
  },
  {
    icon: Target,
    title: "ATS Score",
    description: "Know how well your resume matches the job description.",
  },
  {
    icon: Bot,
    title: "AI Interview",
    description: "Practice AI-generated interview questions.",
  },
  {
    icon: MessageSquare,
    title: "Resume Chat",
    description: "Ask questions about your resume using AI.",
  },
];

function Features() {
  return (
    <section 
      className="py-24 transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ color: "var(--text)" }}>
          Why Choose HireSense AI?
        </h2>

        <p className="text-center mb-14 text-base" style={{ color: "var(--text-light)" }}>
          Everything you need to prepare for your next job.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;