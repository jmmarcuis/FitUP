import React from "react";
import ReactModal from "react-modal";
import "./ClientListModal.scss";
import { Icon } from "@iconify/react";
import { Workout } from "../../../Types/Workout";

interface WorkoutListbyDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  workouts: Workout[];
  selectedDate: string;
  onWorkoutSelect: (workout: Workout) => void;
  onDeleteWorkout: (workoutId: string) => void;
  isDeleting: boolean;
}

export const WorkoutListbyDateModal: React.FC<WorkoutListbyDateModalProps> = ({
  isOpen,
  onClose,
  workouts,
  selectedDate,
  onWorkoutSelect,
  onDeleteWorkout,
  isDeleting,
}) => {
  return (
    <ReactModal
      className="client-list-details-modal"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="header-modal-flex">
        <h2>Workouts for {selectedDate}</h2>
        <Icon icon="material-symbols:close" onClick={onClose} />
      </div>
      <div className="">
        {workouts.length === 0 ? (
          <p>No workouts found for this date.</p>
        ) : (
          workouts.map((workout) => (
            <div key={workout._id} className="client-info-card">
              <div className="coach-info" onClick={() => onWorkoutSelect(workout)}>
                <div className="coach-info-card-left">
                  <img
                    src={workout.collaboration.client.clientImage || "https://res.cloudinary.com/drf4qnjow/image/upload/v1729528071/placeholder/fitup-background_rrtewi.png"}
                    alt=""
                  />
                </div>
                <div className="coach-info-card-right">
                  <h4>{workout.name}</h4>
                  <p>
                    {workout.collaboration.client.firstName}{" "}
                    {workout.collaboration.client.lastName}
                  </p>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => onDeleteWorkout(workout._id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))
        )}
      </div>
    </ReactModal>
  );
};