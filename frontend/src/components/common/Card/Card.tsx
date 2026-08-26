import type { ReactNode, CSSProperties } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function Card({ children, className, style }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border transition-all duration-300 shadow-sm",
        className
      )}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
        boxShadow: "0 4px 16px var(--shadow)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;