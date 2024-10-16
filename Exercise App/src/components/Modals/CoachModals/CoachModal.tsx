import React, { useState } from "react";
import CoachCard from "../../Cards/CoachCards/CoachCard";
import { Icon } from "@iconify/react";
import ReactModal from "react-modal";
import Modal from "react-modal";

import "./CoachModal.scss";
import useGetCoaches from "../../../hooks/useGetCoaches";
import CoachDetailsModal from "../CoachDetailsModal";
import { Coach } from "../../../interfaces/Coach";
Modal.setAppElement('#root'); 


interface CoachModalProps {
  isOpen: boolean; // Updated prop name
  onClose: () => void;
}
const CoachModal: React.FC<CoachModalProps> = ({ isOpen, onClose }) => {
  const { coaches, loading, error } = useGetCoaches();
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isCoachDetailsModalOpen, setIsCoachDetailsModalOpen] = useState(false);

  const handleCoachClick = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsCoachDetailsModalOpen(true);
  };

  const handleCloseCoachDetailsModal = () => {
    setIsCoachDetailsModalOpen(false);
    setSelectedCoach(null);
  };

  const handleCollaborate = (coachId: string) => {
    console.log(`Collaborating with coach: ${coachId}`);
    onClose(); // Close the CoachModal after collaboration
  };

  return (
    <ReactModal
      isOpen={isOpen} // Updated to use the correct prop name
      onRequestClose={onClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <button className="back-button" onClick={onClose} aria-label="Back">
          <Icon icon="mdi:arrow-left" />
        </button>
        <h2>Choose Your Fitness Trainer</h2>
      </div>
      <div className="coach-grid">
        {loading && <p>Loading coaches...</p>}
        {error && <p>Error: {error}</p>}
        {coaches.map((coach) => (
          <CoachCard
            key={coach._id}
            image={coach.profilePicture}
            name={`${coach.firstName} ${coach.lastName}`}
            title={coach.coachSpecialization}
            onClick={() => handleCoachClick(coach)}
          />
        ))}
      </div>
      <CoachDetailsModal
        isOpen={isCoachDetailsModalOpen}
        coach={selectedCoach}
        onClose={handleCloseCoachDetailsModal}
        onCollaborate={handleCollaborate}
      />
    </ReactModal>
  );
};

export default CoachModal;