import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "react-modal";
import "./ExerciseDetails.scss";

interface ExerciseDetails {
  id: number;
  name: string;
  description: string;
  category: string;
  muscles: string[];
  equipment: string[];
  images: string | null;
}

interface ExerciseDetailsModalProps {
  exercise: ExerciseDetails;
  isOpen: boolean;
  onRequestClose: () => void;
  onExerciseAdded: (exerciseId: number) => void;
}

export const ExerciseDetailsModal: React.FC<ExerciseDetailsModalProps> = ({
  exercise,
  isOpen,
  onRequestClose,
  onExerciseAdded,
}) => {
  const handleAddExercise = () => {
    onExerciseAdded(exercise.id);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Exercise Details Modal"
      className="exercise-details-modal"
      overlayClassName="modal-overlay"
    >
      <div className="exercise-details">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{exercise.name}</h3>
          <Icon
            onClick={onRequestClose}
            icon="material-symbols:close"
            className="cursor-pointer"
          />
        </div>
        {exercise.images && (
          <div className="my-4">
            <img
              src={exercise.images}
              alt={exercise.name}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
        <p>
          <strong>Category:</strong> {exercise.category}
        </p>
        <p>
          <strong>Muscles:</strong> {exercise.muscles.join(", ")}
        </p>
        <p>
          <strong>Equipment:</strong> {exercise.equipment.join(", ")}
        </p>
        <p>
          <strong>Description:</strong> {exercise.description}
        </p>

        <div className="add-exercise-form">
          <button onClick={handleAddExercise}>
      
            <Icon icon="material-symbols:add" />
            Add Workout
          </button>
        </div>
      </div>
    </Modal>
  );
};
