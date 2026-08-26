import type { ReactNode } from "react";
import clsx from "clsx";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

function Section({
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={clsx(
        "py-24",
        className
      )}
    >
      {children}
    </section>
  );
}

export default Section;