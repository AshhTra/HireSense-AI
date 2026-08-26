import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import Logo from "../../common/Logo/Logo";

function Footer() {
  return (
    <footer
      className="border-t pt-16 pb-8 transition-colors duration-300"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Logo & Description */}
          <div className="space-y-4">
            <Logo />

            <p
              className="max-w-sm text-sm leading-relaxed"
              style={{ color: "var(--text-light)" }}
            >
              AI-powered resume screening, ATS analysis, interview preparation,
              and career assistance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="mb-4 text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--primary)" }}
            >
              Quick Links
            </h3>

            <div className="flex flex-col gap-2.5 text-sm">
              <Link
                to="/"
                className="transition-colors hover:opacity-80"
                style={{ color: "var(--text-light)" }}
              >
                Home
              </Link>

              <Link
                to="/login"
                className="transition-colors hover:opacity-80"
                style={{ color: "var(--text-light)" }}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="transition-colors hover:opacity-80"
                style={{ color: "var(--text-light)" }}
              >
                Register
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="mb-4 text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--primary)" }}
            >
              Contact
            </h3>

            <p
              className="text-sm"
              style={{ color: "var(--text-light)" }}
            >
              Email:{" "}
              <a
                href="mailto:priyapandey172005@gmail.com"
                className="transition-colors hover:underline"
                style={{ color: "var(--primary)" }}
              >
                priyapandey172005@gmail.com
              </a>
            </p>

            <p
              className="mt-3 flex items-center gap-1.5 text-sm"
              style={{ color: "var(--text-light)" }}
            >
              Built with{" "}
              <Heart
                size={16}
                style={{
                  color: "var(--primary)",
                  fill: "var(--primary)",
                }}
              />
              using React, FastAPI & AI
            </p>
          </div>
        </div>

        <div
          className="mt-12 border-t pt-8 text-center text-xs"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-light)",
          }}
        >
          © {new Date().getFullYear()} HireSense AI. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;