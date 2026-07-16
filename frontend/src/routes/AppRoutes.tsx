import { Navigate, Route, Routes } from "react-router-dom";

import InterviewPage from "../pages/InterviewPage";
import ResumeUploadPage from "../pages/ResumeUploadPage";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import SummaryPage from "../pages/SummaryPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={<ResumeUploadPage />} />
      <Route path="/roles" element={<RoleSelectionPage />} />
      <Route path="/interview/:sessionId" element={<InterviewPage />} />
      <Route path="/summary/:sessionId" element={<SummaryPage />} />
      <Route path="*" element={<Navigate to="/upload" replace />} />
    </Routes>
  );
}
