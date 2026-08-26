import clsx from "clsx";
import type { ReactNode, CSSProperties } from "react";

type BadgeVariant = "primary" | "success" | "gray";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

function Badge({
  children,
  variant = "primary",
  className,
}: BadgeProps) {
  const style: CSSProperties = {};

  switch (variant) {
    case "primary":
      style.backgroundColor = "var(--secondary)";
      style.color = "var(--primary)";
      break;

    case "success":
      style.backgroundColor = "rgba(16,185,129,0.12)";
      style.color = "var(--accent)";
      break;

    case "gray":
      style.backgroundColor = "var(--hover)";
      style.color = "var(--text)";
      break;
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all duration-300",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export default Badge;