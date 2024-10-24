import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { WorkoutProvider } from "./Context/WorkoutContext";
import { ResponsiveProvider } from "./Context/ResponsiveContext";
import { SearchProvider } from "./Context/SearchContext";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
 import "./App.scss";
import { AnimatePresence } from "framer-motion";

const App: React.FC = () => {
  useEffect(() => {
    document.title = "PowerSync Coach"; // Set the document title here
  }, []);

  return (
    <WorkoutProvider>
      <ResponsiveProvider>
        <SearchProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/register" element={<RegisterPage />} /> */}
                <Route
                  path="/dashboard/*" element={<DashboardPage />}
              
                 
                />
                {/* Redirect any unmatched routes to homepage */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </SearchProvider>
      </ResponsiveProvider>
    </WorkoutProvider>
  );
};

export default App;
