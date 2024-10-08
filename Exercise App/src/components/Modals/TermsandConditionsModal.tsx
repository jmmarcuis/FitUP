import React from "react";
import ReactModal from "react-modal";
import "./TermsandConditionsModal.scss";
import { Icon } from "@iconify/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsandConditionsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <>
      <ReactModal
        className="termsAndConditions-modal-content"
        overlayClassName="modal-overlay"
        isOpen={isOpen}
        onRequestClose={onClose}
      >
        <div className="header-flex">
          <h2>Terms and Conditions</h2>
          <Icon onClick={onClose} icon="material-symbols:close" />
        </div>

        <div className="content"></div>

        <div className="button-flex">
          <button>Agree</button>
          <button>Reject</button>
        </div>
      </ReactModal>
    </>
  );
};
