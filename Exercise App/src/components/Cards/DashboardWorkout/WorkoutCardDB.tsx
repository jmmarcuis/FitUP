import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./WorkoutCardDB.scss";

interface WorkoutCardDBProps {
  title: string;
  clientName: string;
  date: string; // Keep this as a string for input
  image: string;
}

const WorkoutCardDB: React.FC<WorkoutCardDBProps> = ({
  title,
  clientName,
  date,
  image,
}) => {
  const navigate = useNavigate();
  const [isClickEnabled, setIsClickEnabled] = useState(false);

  const handleMouseEnter = () => {
    setIsClickEnabled(false);
    setTimeout(() => {
      setIsClickEnabled(true);
    }, 250); // delay to avoid misclicks
  };

  const handleClick = () => {
    if (isClickEnabled) {
      navigate("/dashboard/workouts");
    }
  };

  // Function to format the date from num to string
  // convert 10 = October
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="workout-card-db"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="overlay">
        <div className="workout-info">
          <h3>{title}</h3>
          <p>{clientName}</p>
          <span>{formatDate(date)}</span>
        </div>
        <div
          className="workout-arrow"
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
        >
          <Icon icon="material-symbols:arrow-circle-right-outline" />
        </div>
      </div>
    </div>
  );
};

export default WorkoutCardDB;
