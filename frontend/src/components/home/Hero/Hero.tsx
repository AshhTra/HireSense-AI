import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text)",
      }}
    >
      {/* Background Glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">

          {/* Left */}
          <div className="flex-1 text-center lg:text-left">

            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors md:text-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--primary)",
              }}
            >
              AI-Powered Career Assistant
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Build{" "}
              <span className="bg-linear-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Smarter Careers
              </span>{" "}
              with AI
            </h1>

            <p
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0"
              style={{
                color: "var(--text-light)",
              }}
            >
              Analyze resumes, beat ATS filters, practice mock interviews,
              and identify missing skills—all in one intelligent platform.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">

              <Link
                to="/register"
                className="rounded-xl bg-linear-to-r from-[#0F766E] to-[#10B981] px-7 py-3.5 text-base font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-95"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="rounded-xl border px-7 py-3.5 text-base font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                Login
              </Link>

            </div>

          </div>

          {/* Right */}

          <div className="flex w-full flex-1 justify-center lg:max-w-none">
            <div
              className="w-full max-w-md rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-colors sm:p-8"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="mb-6 flex items-center justify-between">

                <div
                  className="h-5 w-32 animate-pulse rounded-md"
                  style={{
                    backgroundColor: "var(--border)",
                  }}
                />

                <span
                  className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--secondary)",
                    borderColor: "var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  ATS Score: 85%
                </span>

              </div>

              <div className="mb-8 space-y-3">
                <div
                  className="h-4 w-full rounded"
                  style={{ backgroundColor: "var(--background)" }}
                />

                <div
                  className="h-4 w-4/5 rounded"
                  style={{ backgroundColor: "var(--background)" }}
                />

                <div
                  className="h-4 w-3/5 rounded"
                  style={{ backgroundColor: "var(--background)" }}
                />
              </div>

              <div className="rounded-2xl bg-linear-to-r from-teal-700 to-emerald-500 p-4 text-center text-white shadow-md">

                <p className="text-sm font-semibold">
                  AI Resume Analysis Complete
                </p>

                <p className="mt-1 text-xs opacity-80">
                  Ready for Interview Preparation
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;