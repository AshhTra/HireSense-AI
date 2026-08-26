type StepCardProps = {
  step: string;
  title: string;
  description: string;
};

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div 
      className="relative rounded-3xl border p-8 text-center transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "0 4px 20px var(--shadow)",
      }}
    >
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#0F766E] to-[#10B981] text-xl font-extrabold text-white shadow-md shadow-teal-700/20">
        {step}
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

export default StepCard;