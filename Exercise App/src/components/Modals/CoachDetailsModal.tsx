import React from "react";
import Modal from "react-modal";
import { Icon } from "@iconify/react";
import "./CoachDetailsModal.scss";
import { Coach } from "../../interfaces/Coach";
Modal.setAppElement("#root");

interface CoachDetailsModalProps {
  isOpen: boolean;
  coach: Coach | null;
  onClose: () => void;
  onCollaborate: (coachId: string) => void;
  collaborationLoading: boolean;
}

const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({
  isOpen,
  coach,
  onClose,
  onCollaborate,
  collaborationLoading,
}) => {
  if (!isOpen || !coach) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Coach Details"
      className="coach-modal"
      overlayClassName="modal-overlay"
    >
      <button className="back-button" onClick={onClose} aria-label="Back">
        <Icon icon="mdi:arrow-left" />
      </button>
      <div className="image-container">
        <img
          src={coach.profilePicture}
          alt={`${coach.firstName} ${coach.lastName}`}
          className="coach-image"
        />
      </div>
      <div className="coach-info">
        <h4>{`${coach.firstName} ${coach.lastName}`}</h4>
        <p>
          <strong>Specialization:</strong> {coach.coachSpecialization}
        </p>
        <p>
          <strong>Email:</strong> {coach.email}
        </p>
        <p>
          <strong>Description:</strong> {coach.coachDescription}
        </p>
        <button
          className="collaborate-button"
          onClick={() => onCollaborate(coach._id)}
          disabled={collaborationLoading}
        >
          {collaborationLoading ? "Requesting..." : "Request Collaboration"}
        </button>
      </div>
    </Modal>
  );
};

export default CoachDetailsModal;
