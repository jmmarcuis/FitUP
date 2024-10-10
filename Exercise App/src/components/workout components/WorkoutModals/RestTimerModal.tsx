import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import "./RestTimerModal.scss";

const RestTimerModal: React.FC<{
  onStartTimer: () => void;
  onSkip: () => void;
}> = ({ onStartTimer, onSkip }) => {
  const [time, setTime] = useState(230); // starting at 02:30
  const [isActive, setIsActive] = useState(false);
  const [isEditable, setIsEditable] = useState(true); // Track if the timer is editable

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      onSkip();
    }
    return () => clearInterval(interval);
  }, [isActive, time, onSkip]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // allows empty input to clear the timer, but doesn't trigger onSkip
    if (inputValue === "") {
      setTime(0);
      return;
    }

    // Validate input to match MM:SS format
    const regex = /^(60|[0-5][0-9]):([0-5][0-9])$/;
    if (regex.test(inputValue)) {
      const [minsStr, secsStr] = inputValue.split(":");
      const mins = minsStr ? parseInt(minsStr, 10) : 0;
      const secs = secsStr ? parseInt(secsStr, 10) : 0;

      // Update the state only if in editable mode
      if (isEditable && mins >= 0 && mins <= 60 && secs >= 0 && secs < 60) {
        setTime(mins * 60 + secs);
      }
    }
  };

  const handlePlay = () => {
    setIsActive(true);
    setIsEditable(false); // Make the timer uneditable when play is clicked
    onStartTimer(); // Call the onStartTimer function if needed
  };

  const handlePause = () => {
    setIsActive(false); // Pause the timer
    setIsEditable(true); // Allow editing when paused
  };

  const handleSkip = () => {
    setIsActive(false);
    onSkip();
  };

  return (
    <div className="modal-overlay">
      <div className="resttimer-modal">
        <h2>Rest Timer</h2>
        <p>
          Choose a duration below or set your own. Custom durations are saved for next time.
        </p>
        <div className="timer-display">
          <input
            type="text"
            value={formatTime(time)}
            onChange={handleInputChange}
            placeholder="MM:SS"
            maxLength={5}
            className={`timer-input ${isEditable ? "editable" : "not-editable"}`}
            disabled={!isEditable} // Disable input if not editable
          />
          <div className={`edit-indicator ${isEditable ? "editable" : "not-editable"}`}>
            {isEditable ? "Edit Mode" : "Running"}
          </div>
        </div>
        <div className="timer-controls">
          <button className="pauseplay" onClick={handlePlay}>
            <Icon icon="mdi:play" />
          </button>
          <button className="pauseplay" onClick={handlePause}>
            <Icon icon="mdi:pause" />
          </button>
        </div>
        <button className="skip" onClick={handleSkip}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default RestTimerModal;
