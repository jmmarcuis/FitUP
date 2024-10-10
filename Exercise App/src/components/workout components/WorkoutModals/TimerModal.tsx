import React from "react";
//import { Icon } from "@iconify/react";
import "./TimerModal.scss";

interface TimerModalProps {
  onStartTimer: () => void;
  onDecline: () => void;
}

const TimerModal: React.FC<TimerModalProps> = ({ onStartTimer, onDecline }) => {
  return (
    <div className="modal-overlay">
      <div className="timer-modal">
        <p>Set has finished, do you want to set a timer?</p>
        <button onClick={onStartTimer}>Start Timer</button>
        <button onClick={onDecline}>Decline</button>
      </div>
    </div>
  );
};

export default TimerModal;