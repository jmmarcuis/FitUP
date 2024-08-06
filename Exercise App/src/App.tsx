import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { WorkoutProvider } from "./Context/WorkoutContext";
import { useAuth } from "./hooks/useAuth";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import DashboardPage from "./pages/DashboardPage";
import "./App.scss";
import { AnimatePresence } from 'framer-motion';

// Create a ProtectedRoute component
const ProtectedRoute: React.FC<{ element: React.ReactElement, requireProfileCompletion?: boolean }> = ({
  element,
  requireProfileCompletion = true,
}) => {
  const { isAuthenticated, isProfileCompleted, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireProfileCompletion && !isProfileCompleted) {
    return <Navigate to="/complete-profile" />;
  }

  return element;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute 
                    element={<CompleteProfilePage />} 
                    requireProfileCompletion={false}
                  />
                }
              />
              <Route
                path="/dashboard"
               
              />
              {/* Redirect any unmatched routes to homepage */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </WorkoutProvider>
    </AuthProvider>
  );
};

export default App;