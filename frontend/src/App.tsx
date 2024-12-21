// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate ,useLocation} from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { AuthPage } from "./components/Auth/AuthPage";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
// import { Chatbot } from "./components/Chatbot//Chatbot";
import { Chatbot } from "./components/Chatbot/newChatbot";
import { Logout } from "./components/logout";

const App = () => {

  const useCurrentLocation = () => {
    const location = useLocation();
    return location;
  };

  // Usage:
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </AuthProvider>
        {window.location.pathname !== "/login" && <Logout />}
    </BrowserRouter>
  );
};

export default App;
