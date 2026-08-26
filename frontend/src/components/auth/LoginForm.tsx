import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import Button from "../common/Button/Button";
import Input from "../common/Input/Input";
import MonkeyIcon from "../common/MonkeyIcon/MonkeyIcon";

import { loginUser } from "../../services/authService";

function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email,
        password,
      });

      if (response.detail) {
        setError(response.detail);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      navigate("/dashboard");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full max-w-md"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text)",
      }}
    >
      <div className="mb-8">
        <h2
          className="text-3xl font-bold transition-colors"
          style={{ color: "var(--text)" }}
        >
          Welcome Back
        </h2>

        <p
          className="mt-2 transition-colors"
          style={{ color: "var(--text-light)" }}
        >
          Login to continue your AI-powered resume journey.
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={handleLogin}
      >
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail size={20} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          icon={<Lock size={20} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="cursor-pointer flex items-center justify-center p-0.5 rounded-lg transition-transform duration-200 hover:scale-110 active:scale-90"
              title={
                showPassword
                  ? "Hide Password"
                  : "Show Password"
              }
            >
              <MonkeyIcon
                isClosed={!showPassword}
                className="w-7 h-7"
              />
            </button>
          }
        />

        <div className="flex items-center justify-between">
          <label
            className="flex items-center gap-2 text-sm cursor-pointer transition-colors"
            style={{ color: "var(--text-light)" }}
          >
            <input
              type="checkbox"
              className="accent-[#0F766E] h-4 w-4 rounded border-slate-300 cursor-pointer"
            />
            Remember Me
          </label>

          <button
            type="button"
            className="text-sm font-medium hover:underline cursor-pointer transition-colors"
            style={{ color: "var(--primary)" }}
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          className="bg-linear-to-r from-[#0F766E] to-[#10B981] text-white hover:opacity-95 shadow-md border-0 py-3 text-base font-semibold cursor-pointer"
        >
          {loading ? "Logging In..." : "Login"}
        </Button>
      </form>

      <p
        className="mt-8 text-center transition-colors"
        style={{ color: "var(--text-light)" }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold hover:underline transition-colors"
          style={{ color: "var(--primary)" }}
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;