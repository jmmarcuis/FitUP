import React from "react";
import { Icon } from "@iconify/react";
import "./CoachDetailsModal.scss";

interface CoachDetailsModalProps {
  image: string;
  name: string;
  description: string;
  onClose: () => void;
}

const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({
  image,
  name,
  description,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="coach-modal">
        <button className="back-button" onClick={onClose} aria-label="Back">
          <Icon icon="mdi:arrow-left" />
        </button>

        <div className="image-container">
          <img src={image} alt={name} className="coach-image" />
        </div>

        <div className="coach-info">
          <h4>{name}</h4>
          <p>{description}</p>
          <button className="collaborate-button">Collaborate</button>
        </div>
      </div>
    </div>
  );
};

export default CoachDetailsModal;