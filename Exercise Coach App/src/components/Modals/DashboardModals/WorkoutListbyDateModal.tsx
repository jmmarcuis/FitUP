import React from "react";
import ReactModal from "react-modal";
import "./ClientListModal.scss";
import { Icon } from "@iconify/react";
import { Workout } from "../../../hooks/useSelectedWorkout";

interface WorkoutListbyDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  workouts: Workout[];
  selectedDate: string;
  onWorkoutSelect: (workout: Workout) => void;
}

export const WorkoutListbyDateModal: React.FC<WorkoutListbyDateModalProps> = ({
  isOpen,
  onClose,
  workouts,
  selectedDate,
  onWorkoutSelect,
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
            <div
              key={workout._id}
              className="client-info-card"
              onClick={() => onWorkoutSelect(workout)}
            >
              <div className="coach-info">
                <h4>{workout.name}</h4>
                <p>{workout.collaboration.client.firstName} {workout.collaboration.client.lastName}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </ReactModal>
  );
};