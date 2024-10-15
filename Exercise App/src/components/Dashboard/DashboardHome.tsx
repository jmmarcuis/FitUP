import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { getGreeting } from "../Utilities/Greeting";
import "./DashboardHome.scss";
import CoachCard from "../Cards/CoachCard";
import CoachDetailsModal from "../Modals/CoachDetailsModal";
import { ToastContainer, toast } from "react-toastify";
import CoachModal from "../Modals/CoachModal";
import ToggleLightDarkSwitch from "../common/ToggleLightDarkSwitch";
import useGetCoaches from "../../hooks/useGetCoaches";
import useCollaboration from "../../hooks/useCollaboration";
import { Coach } from "../../interfaces/Coach";
import { BarLoader } from "react-spinners";

const DashboardHome: React.FC = () => {
  const greeting = getGreeting();
  const { coaches, loading, error } = useGetCoaches();
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const { requestCollaboration, loading: collaborationLoading, error: collaborationError } = useCollaboration();
  const [isCoachDetailsModalOpen, setIsCoachDetailsModalOpen] = useState(false);
  const [isCoachListModalOpen, setIsCoachListModalOpen] = useState(false);

  const handleCoachClick = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsCoachDetailsModalOpen(true);
  };

  const handleCloseCoachDetailsModal = () => {
    setIsCoachDetailsModalOpen(false);
    setSelectedCoach(null);
  };

  const handleCollaborate = async (coachId: string) => {
    try {
      const clientId = localStorage.getItem('clientId');  
      if (!clientId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }
      
      const response = await requestCollaboration({ clientId, coachId });
      toast.success(response.message);
      handleCloseCoachDetailsModal();
    } catch (err) {
      if (collaborationError) {
        toast.error(collaborationError);
      } else {
        toast.error("Failed to request collaboration. Please try again.");
      }
    }
  };
  const handleSeeMoreClick = () => {
    setIsCoachListModalOpen(true);
  };

  const handleCloseCoachModal = () => {
    setIsCoachListModalOpen(false);
  };

  
  const notifyNextFeature = () => toast.info("This feature is coming soon!");

  return (
    <div className="dashboard-home-container">
      <header className="dashboard-header">
        <div className="greeting">
          <h2>{greeting}</h2>
        </div>
        <div className="header-icons">
          <ToggleLightDarkSwitch />
          <div onClick={notifyNextFeature}>
            <Icon icon="mdi:bell" className="header-icon" />
          </div>
          <Icon icon="mdi:plus" className="header-icon" />
        </div>
      </header>

      <section className="coach-section">
        <div className="coach-text">
          <h3>
            Not sure what your goals are? Select from our Personal Trainers
          </h3>
          <a className="see-more" onClick={handleSeeMoreClick}>
            See more &gt;
          </a>
        </div>
        <div className="coach-slider">
          {loading ? (
            <BarLoader color="#ffffff" loading={true} width={300} />
          ) : error ? (
            <div className="error-message">Failed to load client details.</div>
          ) : (
            coaches.slice(0, 3).map((coach) => (
              <CoachCard
                key={coach._id}
                coach={coach}
                onClick={handleCoachClick}
                loading={false}
              />
            ))
          )}
        </div>
      </section>
      <CoachDetailsModal
        isOpen={isCoachDetailsModalOpen}
        coach={selectedCoach}
        onClose={handleCloseCoachDetailsModal}
        onCollaborate={handleCollaborate}
        collaborationLoading={collaborationLoading}
      />
      <CoachModal
        isOpen={isCoachListModalOpen}
        coaches={coaches}
        onClose={handleCloseCoachModal}
        onCoachClick={handleCoachClick}
      />
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
    </div>
  );
};
export default DashboardHome;
