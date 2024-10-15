import React from "react";
import "./RequestSent.scss";

interface RequestSentProps {
  onOk: () => void;
}

const RequestSent: React.FC<RequestSentProps> = ({ onOk }) => {
  return (
    <div className="modal-overlay">
      <div className="request-sent-modal">
        <p className="emoji">🏋️‍️</p>
        <h2>Request Sent</h2>
        <br />
        <p>We will notify you as soon as possible.</p>
        <button onClick={onOk}>Ok</button>
      </div>
    </div>
  );
};

export default RequestSent;
