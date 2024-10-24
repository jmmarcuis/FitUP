import React from "react";
import ReactModal from "react-modal";
import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <ReactModal
      className="confirmation-modal-content"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <h2>Confirmation</h2>
      <p>{message}</p>
      <div className="button-container">
        <button id="agree" onClick={onConfirm}>
          Confirm
        </button>
        <button id="reject" onClick={onClose}>
          Cancel
        </button>
      </div>
    </ReactModal>
  );
};
