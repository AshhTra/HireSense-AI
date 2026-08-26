import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div 
      className="group rounded-3xl border p-6 shadow-sm transition-all hover:border-teal-500/50 hover:shadow-xl hover:-translate-y-1"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div 
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors group-hover:bg-[#0F766E] group-hover:text-white"
        style={{
          backgroundColor: "var(--secondary)",
          color: "var(--primary)",
        }}
      >
        <Icon size={24} />
      </div>

      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
        {title}
      </h3>

      <p className="text-sm leading-relaxed" style={{ color: "var(--text-light)" }}>
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;