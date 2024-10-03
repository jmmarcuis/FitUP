import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import CoachCard from "../Cards/CoachCard";
import CoachModal from "../Modals/CoachModal";
import TrainerDetailsModal from "../Modals/CoachDetailsModal";
import { getGreeting } from "../Utilities/Greeting";
import "./DashboardHome.scss";

import coach1 from "../../assets/TrainerImages/coach-1.jpg";
import coach2 from "../../assets/TrainerImages/coach-2.jpg";
import coach3 from "../../assets/TrainerImages/coach-3.jpg";
import coach4 from "../../assets/TrainerImages/coach-4.jpg";
import coach5 from "../../assets/TrainerImages/coach-5.jpg";

// Coach data
const coaches = [
  { image: coach1, name: "Melissa Alcantara", title: "Yoga Instructor" },
  { image: coach2, name: "Jono Castano", title: "HIIT Instructor" },
  { image: coach3, name: "Michael Sandor", title: "Powerlifting Instructor" },
  { image: coach4, name: "Brooke Bark", title: "Yoga Instructor" },
  { image: coach5, name: "Samson Dickenson", title: "Bodybuilding Instructor" },
  { image: coach2, name: "Jono Castano", title: "HIIT Instructor" },
  { image: coach3, name: "Michael Sandor", title: "Powerlifting Instructor" },
  { image: coach4, name: "Brooke Bark", title: "Yoga Instructor" },
  { image: coach5, name: "Samson Dickenson", title: "Bodybuilding Instructor" },
];

// Header Component
const Header: React.FC<{ greeting: string }> = ({ greeting }) => (
  <header className="dashboard-header">
    <div className="greeting">
      <h2>{greeting}</h2>
      <p>Current Workout for Today</p>
    </div>
    <div className="header-icons">
      <Icon icon="mdi:moon-waning-crescent" className="header-icon" />
      <Icon icon="mdi:bell" className="header-icon" />
      <Icon icon="mdi:plus" className="header-icon" />
    </div>
  </header>
);

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

  const greetingMessage = getGreeting();

  return (
    <div className="dashboard-home-container">
      <Header greeting={greetingMessage} />

      <CoachSection
        coaches={coaches}
        onShowModal={() => setShowTrainersModal(true)}
        onSelectTrainer={setSelectedTrainer}
      />

      {showTrainersModal && (
        <CoachModal
          coach={coaches}
          onClose={() => setShowTrainersModal(false)}
          onSelectTrainer={setSelectedTrainer}
        />
      )}

      {selectedTrainer && (
        <TrainerDetailsModal
          image={selectedTrainer.image}
          name={selectedTrainer.name}
          description={`${selectedTrainer.name} is a professional ${selectedTrainer.title} with years of experience. Let's collaborate to reach your goals!`}
          onClose={() => setSelectedTrainer(null)}
        />
      )}
    </div>
  );
};

export default DashboardHome;