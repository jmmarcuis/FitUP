import React from "react";
import CoachCard from "../Cards/CoachCard";
import { Icon } from "@iconify/react";
import "./CoachModal.scss";
import { Coach } from "../../interfaces/Coach";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface CoachModalProps {
  isOpen: boolean;
  coaches: Coach[];
  onClose: () => void;
  onCoachClick: (coach: Coach) => void;
}

const CoachModal: React.FC<CoachModalProps> = ({
  isOpen,
  coaches,
  onClose,
  onCoachClick,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Coach Details"
      overlayClassName="modal-overlay"
      className="coachlist-modal"
    >
      <div className="modal-header">
        <button className="back-button" onClick={onClose} aria-label="Back">
          <Icon icon="mdi:arrow-left" />
        </button>
        <h2>Choose Your Fitness Trainer</h2>
      </div>
      <div className="coach-grid">
        {coaches.map((coach) => (
          <CoachCard
            key={coach._id}
            coach={coach}
            onClick={() => onCoachClick(coach)}
            loading={false}
          />
        ))}
      </div>
    </Modal>
  );
};

export default CoachModal;
