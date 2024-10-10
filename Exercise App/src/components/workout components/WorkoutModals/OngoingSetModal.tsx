import React from "react";
import "./OngoingSetModal.scss";

interface OngoingSetModalProps {
  onFinishSet: () => void;
  onFinishSetAndShare: () => void;
  onCancel: () => void;
}

const OngoingSetModal: React.FC<OngoingSetModalProps> = ({
  onFinishSet,
  onFinishSetAndShare,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div className="ongoing-set-modal">
        <p>Set is</p>
        <p>ongoing...</p><br/>
        <button onClick={onFinishSet}>Finish Set</button>
        <button onClick={onFinishSetAndShare}>Finish Set and Share</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default OngoingSetModal;