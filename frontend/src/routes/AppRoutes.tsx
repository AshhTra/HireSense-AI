import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import ResumeUpload from "../pages/ResumeUpload";
import ComingSoon from "../pages/ComingSoon";
import Results from "../pages/Results";
import Interview from "../pages/Interview";
import History from "../pages/History";
import Profile from "../pages/Profile";
import Chat from "../pages/Chat";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume-analysis" element={<Upload />} />
        <Route path="/resume-analysis/upload" element={<ResumeUpload />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/results" element={<Results />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;