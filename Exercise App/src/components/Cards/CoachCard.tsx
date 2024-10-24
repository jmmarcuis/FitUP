import React from "react";
import "./CoachCard.scss";
import { Coach } from "../../interfaces/Coach";
import { ClipLoader } from "react-spinners";
interface CoachCardProps {
  coach: Coach;
  onClick: (coach: Coach) => void;
  loading: boolean;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach, onClick, loading }) => {
  return (
    <>
      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#ffffff" loading={true} size={50} />
        </div>
      ) : (
        <div className="coach-card" onClick={() => onClick(coach)}>
          <div className="image-container">
            <img
              src={coach.profilePicture}
              alt={`${coach.firstName} ${coach.lastName}`}
              className="coach-image"
            />
            <div className="overlay">
              <h4>{`${coach.firstName} ${coach.lastName}`}</h4>
              <p>{coach.coachSpecialization}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoachCard;
