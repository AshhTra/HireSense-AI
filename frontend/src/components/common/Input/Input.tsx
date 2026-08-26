import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

function Input({
  label,
  error,
  icon,
  rightIcon,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-sm font-medium transition-colors"
        style={{ color: "var(--text)" }}
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--text-light)" }}
          >
            {icon}
          </div>
        )}

        <input
          className={clsx(
            "w-full rounded-xl border py-3 outline-none transition-all duration-300",
            icon ? "pl-12" : "pl-4",
            rightIcon ? "pr-12" : "pr-4",
            "focus:ring-4",
            error && "border-red-500 focus:ring-red-100",
            className
          )}
          style={{
            backgroundColor: "var(--surface)",
            borderColor: error ? "#EF4444" : "var(--border)",
            color: "var(--text)",
          }}
          {...props}
        />

        {rightIcon && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--text-light)" }}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;