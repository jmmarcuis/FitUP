import React from "react";
import CoachCard from "../../Cards/CoachCards/CoachCard";
import { Icon } from "@iconify/react";
import "./CoachModal.scss";

interface Coach {
  image: string;
  name: string;
  title: string;
}

interface CoachModalProps {
  isOpen: boolean;
  coach: Coach[];
  onClose: () => void;
  onSelectTrainer: (trainer: Coach) => void;
}

const CoachModal: React.FC<CoachModalProps> = ({
  isOpen,
  coach,
  onClose,
  onSelectTrainer,
}) => {
  if (!isOpen) return null; // will not render if not open

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <button className="back-button" onClick={onClose} aria-label="Back">
            <Icon icon="mdi:arrow-left" />
          </button>
          <h2>Choose Your Fitness Trainer</h2>
        </div>
        <div className="coach-grid">
          {coach.map((coach, index) => (
            <CoachCard
              key={index}
              image={coach.image}
              name={coach.name}
              title={coach.title}
              onClick={() => onSelectTrainer(coach)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachModal;
