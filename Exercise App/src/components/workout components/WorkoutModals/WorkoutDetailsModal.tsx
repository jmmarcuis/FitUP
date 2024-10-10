import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import OngoingSetModal from "./OngoingSetModal";
import VideoSentModal from "./VideoSentModal";
import TimerModal from "./TimerModal";
import RestTimerModal from "./RestTimerModal";
import RestComplete from "./RestComplete";
import "./WorkoutDetailsModal.scss";

interface WorkoutDetailsModalProps {
  image: string;
  name: string;
  description: string;
  onClose: () => void;
}

const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({
  image,
  name,
  description,
  onClose,
}) => {
  const [isOngoingSetModalOpen, setIsOngoingSetModalOpen] = useState(false);
  const [isVideoSentModalOpen, setIsVideoSentModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isRestTimerModalOpen, setIsRestTimerModalOpen] = useState(false);
  const [isRestCompleteOpen, setIsRestCompleteOpen] = useState(false);
  const [isWorkoutModalVisible, setIsWorkoutModalVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Determine if any modal is open
    const anyModalOpen =
      isOngoingSetModalOpen ||
      isVideoSentModalOpen ||
      isTimerModalOpen ||
      isRestTimerModalOpen ||
      isRestCompleteOpen ||
      isWorkoutModalVisible;

    setModalVisible(anyModalOpen);

    // Close the main modal when all sub-modals are closed
    if (!anyModalOpen) {
      onClose();
    }
  }, [
    isOngoingSetModalOpen,
    isVideoSentModalOpen,
    isTimerModalOpen,
    isRestTimerModalOpen,
    isRestCompleteOpen,
    isWorkoutModalVisible,
    onClose,
  ]);

  // [modal]WorkoutDetails -> [button]StartSet -> [modal]OngoingSet
  const handleStartSet = () => {
    setIsWorkoutModalVisible(false);
    setIsOngoingSetModalOpen(true);
  };

  // [modal]OngoingSet -> [button]FinishSet -> [modal]SetTimer?
  const handleFinishSet = () => {
    setIsOngoingSetModalOpen(false);
    setIsTimerModalOpen(true);
  };

  // [modal]OngoingSet -> [button]FinishSet&Share -> [modal]VideoSentConfirm
  const handleFinishSetAndShare = () => {
    setIsOngoingSetModalOpen(false);
    setIsVideoSentModalOpen(true);
  };

  // [modal]VideoSetConfirm -> [button]Ok -> [modal]SetTimer?
  const handleVideoSentOk = () => {
    setIsVideoSentModalOpen(false);
    setIsTimerModalOpen(true);
  };

  // [modal]SetTimer? -> [button]StartTimer -> [modal]RestTimer
  const handleStartTimer = () => {
    setIsTimerModalOpen(false);
    setIsRestTimerModalOpen(true);
  };

  // [modal]RestTimer -> [button]Skip -> [modal]RestComplete
  const handleSkip = () => {
    setIsRestTimerModalOpen(false);
    setIsRestCompleteOpen(true);
  };

  // [modal]OngoingSet -> [button]Cancel -> [modal]WorkoutDetails
  const handleCancelOngoingSet = () => {
    setIsOngoingSetModalOpen(false);
    setIsWorkoutModalVisible(true); // show WorkoutDetailsModal again
  };

  return (
    <div className={`modal-overlay ${modalVisible ? "modal-visible" : ""}`}>
      {isWorkoutModalVisible && (
        <div className={`workout-modal ${modalVisible ? "modal-visible" : ""}`}>
          <button className="back-button" onClick={onClose} aria-label="Back">
            <Icon icon="mdi:arrow-left" />
          </button>

          <div className="image-container">
            <img src={image} alt={name} className="workout-image" />
          </div>

          <div className="workout-info">
            <h4>{name}</h4>
            <p>
              {description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <button className="collaborate-button" onClick={handleStartSet}>
              Start Set
            </button>
          </div>
        </div>
      )}

      {isOngoingSetModalOpen && (
        <OngoingSetModal
          onFinishSet={handleFinishSet}
          onFinishSetAndShare={handleFinishSetAndShare}
          onCancel={handleCancelOngoingSet}
        />
      )}
      {isVideoSentModalOpen && <VideoSentModal onOk={handleVideoSentOk} />}
      {isTimerModalOpen && (
        <TimerModal
          onStartTimer={handleStartTimer}
          onDecline={() => setIsTimerModalOpen(false)}
        />
      )}
      {isRestTimerModalOpen && (
        <RestTimerModal onSkip={handleSkip} onStartTimer={handleStartTimer} />
      )}
      {isRestCompleteOpen && (
        <RestComplete onOk={() => setIsRestCompleteOpen(false)} />
      )}
    </div>
  );
};

export default WorkoutDetailsModal;
