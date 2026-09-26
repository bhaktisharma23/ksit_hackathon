import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { VideoAnalysisProvider } from "./context/VideoAnalysisContext";

export default function App() {
  return (
    <BrowserRouter>
      <VideoAnalysisProvider>
        <AppRoutes />
      </VideoAnalysisProvider>
    </BrowserRouter>
  );
}