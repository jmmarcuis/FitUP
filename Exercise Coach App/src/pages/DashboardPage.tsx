// DashboardPage.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDashboardLayout } from "../hooks/useDashboardLayout";
import MobileDashboard from "../components/Dashboard/MobileDashboard";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
// import DashboardRightSidebar from "../components/Dashboard/DashboardRightSidebar";
import "./DashboardPage.scss";
import { motion } from "framer-motion";

import DashboardHome from "../components/Dashboard/DashboardHome";
// import Workouts from "../components/Dashboard/Workouts";
// import Settings from "../components/Dashboard/Settings";
import Messages from "../components/Dashboard/Messages";

const DashboardPage: React.FC = () => {
  const { isMobile, showRightSidebar } = useDashboardLayout();

  const pageTransition = {
    initial: { y: 20 },
    animate: { y: 0 },
    exit: { y: -20 },
  };

  return (
    <motion.div
      className={`dashboard-container ${isMobile ? "mobile" : ""}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <div className="dashboard-content">
        {!isMobile && <DashboardSidebar />}
        <main>
          {isMobile ? (
            <MobileDashboard />
          ) : (
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              {/* <Route path="workouts" element={<Workouts />} /> */}
              {/* <Route path="settings" element={<Settings />} /> */}
              <Route path="messages" element={<Messages />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </main>
       </div>
    </motion.div>
  );
};

export default DashboardPage;