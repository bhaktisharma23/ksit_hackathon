import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import VideoAnalysis from "../pages/VideoAnalysis";
import RealTimeMonitoring from "../pages/RealTimeMonitoring";
import AlertLogs from "../pages/AlertLogs";
import History from "../pages/History";
import AIModels from "../pages/AIModels";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/video-analysis" element={<VideoAnalysis />} />
      <Route path="/monitoring" element={<RealTimeMonitoring />} />
      <Route path="/alerts" element={<AlertLogs />} />
      <Route path="/history" element={<History />} />
      <Route path="/models" element={<AIModels />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}