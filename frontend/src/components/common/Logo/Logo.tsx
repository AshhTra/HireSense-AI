import { Bot } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";

type LogoProps = {
  showText?: boolean;
  light?: boolean;
};

function Logo({ showText = true, light = false }: LogoProps) {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 transition-opacity hover:opacity-90"
    >
      {/* Logo Icon */}
      <div
        className={clsx(
          "flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-md transition-all duration-300",
          light
            ? "bg-[#0F766E] border border-teal-500/30"
            : "bg-linear-to-br from-[#0F766E] to-[#10B981]"
        )}
      >
        <Bot size={22} />
      </div>

      {showText && (
        <div>
          <h1
            className="text-lg font-bold tracking-tight transition-colors duration-300"
            style={{
              color: light ? "#FFFFFF" : "var(--text)",
            }}
          >
            HireSense AI
          </h1>

          <p
            className="text-xs transition-colors duration-300"
            style={{
              color: light ? "#99F6E4" : "var(--text-light)",
            }}
          >
            Intelligent Resume Platform
          </p>
        </div>
      )}
    </Link>
  );
}

export default Logo;