import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

import Button from "../common/Button/Button";
import Input from "../common/Input/Input";
import MonkeyIcon from "../common/MonkeyIcon/MonkeyIcon";

// import { registerUser } from "../../services/auth";
import { registerUser } from "../../services/authService";

function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const response = await registerUser({
      full_name: fullName,
      email,
      password,
    });

    setLoading(false);

    if (response.detail) {
      setError(response.detail);
      return;
    }

    navigate("/login");
  }

  return (
    <div
      className="w-full max-w-md transition-colors"
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
          Create Account
        </h2>

        <p
          className="mt-2 transition-colors"
          style={{ color: "var(--text-light)" }}
        >
          Start your AI-powered career journey today.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={handleRegister}
      >
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          icon={<User size={20} />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

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
          placeholder="Create a password"
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
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </Button>
      </form>

      <p
        className="mt-8 text-center transition-colors"
        style={{ color: "var(--text-light)" }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold hover:underline transition-colors"
          style={{ color: "var(--primary)" }}
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;