import React, { useState } from "react";
import { Icon } from "@iconify/react";
import RequestSent from "../DashboardModals/RequestSent";
import "./CoachDetailsModal.scss";

interface CoachDetailsModalProps {
  image: string;
  name: string;
  description: string;
  onClose: () => void;
  showCollaborateButton?: boolean;
}

const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({
  image,
  name,
  description,
  onClose,
  showCollaborateButton = true,
}) => {
  const [isRequestSent, setIsRequestSent] = useState(false);

  const handleCollaborateClick = () => {
    setIsRequestSent(true);
  };

  const handleOk = () => {
    setIsRequestSent(false); 
    onClose(); 
  };

  return (
    <>
      {isRequestSent ? (
        <RequestSent onOk={handleOk} />
      ) : (
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
              {showCollaborateButton && ( // Conditionally render the button
                <button
                  className="collaborate-button"
                  onClick={handleCollaborateClick}
                >
                  Collaborate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoachDetailsModal;
