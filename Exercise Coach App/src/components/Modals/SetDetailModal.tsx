// components/Modals/SetDetailModal.tsx
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import "./SetDetailModal.scss";

interface SetDetailModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  initialValue: number;
  fieldName: string;
}

export const SetDetailModal: React.FC<SetDetailModal> = ({
  isOpen,
  onClose,
  onConfirm,
  initialValue,
  fieldName,
}) => {
  const [value, setValue] = useState<number>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
  };

  return (
    <ReactModal
      className="set-detail-modal-content"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <h2>Update {fieldName}</h2>
      <div className="input-container">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          autoFocus
        />
      </div>
      <div className="button-container">
        <button className="confirm-button" onClick={handleConfirm}>
          Confirm
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </ReactModal>
  );
};