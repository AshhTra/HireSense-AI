import { Sparkles, ShieldCheck, FileText } from "lucide-react";

import Container from "../components/common/Container/Container";
import Card from "../components/common/Card/Card";
import Logo from "../components/common/Logo/Logo";
import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <div 
      className="min-h-screen transition-colors duration-300 flex items-center justify-center py-10"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Container>
        <div className="flex justify-center">
          <Card
            className="w-full max-w-5xl overflow-hidden p-0"
            style={{
              boxShadow: "0 16px 40px var(--shadow)",
            }}
          >
            <div className="grid lg:grid-cols-2">

              {/* Left Side - Brand Banner */}
              <div className="flex flex-col justify-between bg-linear-to-br from-teal-700 to-emerald-500 p-10 lg:p-12 text-white">
                <div>
                  <Logo light />

                  <h1 className="mt-10 text-4xl lg:text-5xl font-bold leading-tight">
                    Welcome Back.
                  </h1>

                  <p className="mt-4 text-base lg:text-lg text-teal-100/90 leading-relaxed">
                    Continue building your career with AI-powered resume
                    analysis, ATS scoring and interview preparation.
                  </p>
                </div>

                <div className="space-y-4 mt-12 text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} />
                    <span>Secure Authentication</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText size={20} />
                    <span>Smart Resume Analysis</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Sparkles size={20} />
                    <span>AI Interview Assistant</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form Container */}
              <div 
                className="flex items-center justify-center p-8 lg:p-12 transition-colors duration-300"
                style={{ backgroundColor: "var(--background)"}}
              >
                <LoginForm />
              </div>

            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Login;