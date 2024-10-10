import React, { useState } from "react";
import "./CoachCard.scss";

interface CoachCardProps {
  image: string;
  name: string;
  title: string;
  onClick: () => void;
}

const CoachCard: React.FC<CoachCardProps> = ({
  image,
  name,
  title,
  onClick,
}) => {
  const [isClickEnabled, setIsClickEnabled] = useState(false);

  const handleMouseEnter = () => {
    setIsClickEnabled(false);
    setTimeout(() => {
      setIsClickEnabled(true);
    }, 250); // delay to avoid misclicks
  };

  const handleClick = () => {
    if (isClickEnabled) {
      onClick();
    }
  };

  return (
    <div className="coach-card" onMouseEnter={handleMouseEnter} onClick={handleClick}>
      <div className="image-container">
        <img src={image} alt={name} className="coach-image" />
        <div className="overlay">
          <h4>{name}</h4>
          <p>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default CoachCard;
