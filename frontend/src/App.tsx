import { BrowserRouter } from "react-router-dom";

import Header from "./components/layout/Header";
import { InterviewSessionProvider } from "./context/InterviewSessionContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <InterviewSessionProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col">
            <AppRoutes />
          </main>
        </div>
      </InterviewSessionProvider>
    </BrowserRouter>
  );
}

export default App;
