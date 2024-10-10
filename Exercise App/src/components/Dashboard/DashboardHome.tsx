import React, { useState, useRef } from "react";
import CoachCard from "../Cards/CoachCards/CoachCard";
import WorkoutCardDB from "../Cards/DashboardWorkout/WorkoutCardDB";
import CoachModal from "../Modals/CoachModals/CoachModal";
import TrainerDetailsModal from "../Modals/CoachModals/CoachDetailsModal";
import DashboardHeader from "./DashboardHeader";
import { getGreeting } from "../Utilities/Greeting";
import mockCoaches from "../../mocks/mockCoaches";
import mockWorkouts from "../../mocks/mockWorkouts";
import "./DashboardHome.scss";
import benchpressImage from "../../assets/WorkoutImages/benchpress.jpeg";

// Coach Section Component
const CoachSection: React.FC<{
  coaches: Array<{ image: string; name: string; title: string }>;
  onShowModal: () => void;
  onSelectTrainer: (trainer: {
    image: string;
    name: string;
    title: string;
  }) => void;
}> = ({ coaches, onShowModal, onSelectTrainer }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // horizontal scrolling when u click and drag coach images left to right
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!sliderRef.current) return;

    const startX = event.pageX - sliderRef.current.offsetLeft;
    const scrollLeft = sliderRef.current.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - sliderRef.current!.offsetLeft;
      const walk = (x - startX) * 4;
      sliderRef.current!.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <section className="coach-section">
      <div className="coach-text">
        <h3>Not sure what your goals are? Select from our Personal Trainers</h3>
        <a className="see-more" onClick={onShowModal}>
          See more &gt;
        </a>
      </div>
      <div
        className="coach-slider"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
      >
        {coaches.map((coach, index) => (
          <CoachCard
            key={index}
            image={coach.image}
            name={coach.name}
            title={coach.title}
            onClick={() => onSelectTrainer(coach)}
          />
        ))}
      </div>
    </section>
  );
};

// Main DashboardHome Component
const DashboardHome: React.FC = () => {
  const [showTrainersModal, setShowTrainersModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<{
    image: string;
    name: string;
    title: string;
  } | null>(null);

  // header data
  const greetingMessage = getGreeting();
  const welcomeMessage = "Current Workout for Today";
  const handleShowModal = () => {
    setShowTrainersModal(true);
  };

  return (
    <div className="dashboard-home-container">
      <DashboardHeader
        greeting={greetingMessage}
        onShowModal={handleShowModal}
        welcomeMessage={welcomeMessage}
      />
      <div className="dashboard-contents">
        <div className="workout-list">
          {mockWorkouts.map((workout) => (
            <WorkoutCardDB
              key={workout._id}
              title={workout.title}
              clientName={workout.coachName}
              date={new Date(workout.date).toLocaleDateString()}
              image={benchpressImage}
            />
          ))}
        </div>

        <CoachSection
          coaches={mockCoaches}
          onShowModal={() => setShowTrainersModal(true)}
          onSelectTrainer={setSelectedTrainer}
        />

        {showTrainersModal && (
          <CoachModal
            isOpen={showTrainersModal}
            onClose={() => setShowTrainersModal(false)}
            coach={mockCoaches}
            onSelectTrainer={setSelectedTrainer}
          />
        )}

        {selectedTrainer && (
          <TrainerDetailsModal
            image={selectedTrainer.image}
            name={selectedTrainer.name}
            description={`${selectedTrainer.name} is a professional ${selectedTrainer.title} with years of experience. Let's collaborate to reach your goals!`}
            onClose={() => setSelectedTrainer(null)}
            showCollaborateButton={true}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
