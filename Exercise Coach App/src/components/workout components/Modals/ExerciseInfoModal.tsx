import React, { useState } from "react";
import ReactModal from "react-modal";
import { Exercise } from "../../../Types/Exercise";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import "./ExerciseInfoModal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onAddWorkout: (exerciseId: string, sets: number, reps: number, weight: number, rpe: number) => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, exercise, onAddWorkout }) => {
  const [sets, setSets] = useState(1);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);
  const [rpe, setRpe] = useState(1);

  const handleSubmit = () => {
    if (exercise) {
      onAddWorkout(exercise._id, sets, reps, weight, rpe);
    }
  };

  if (!exercise) return null;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-flex">
        <h2>{exercise.name}</h2>
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={onClose}
        >
          <Icon icon="mdi:close" />
        </motion.div>
      </div>
      <p><strong>Type:</strong> {exercise.type}</p>
      <p><strong>Muscle:</strong> {exercise.muscle}</p>
      <h3>Instructions:</h3>
      <p>{exercise.instructions}</p>
      <div className="modal-controls">
        <input type="number" value={sets} onChange={(e) => setSets(+e.target.value)} />
        <input type="number" value={reps} onChange={(e) => setReps(+e.target.value)} />
        <input type="number" value={weight} onChange={(e) => setWeight(+e.target.value)} />
        <input type="number" value={rpe} onChange={(e) => setRpe(+e.target.value)} />
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="add-workout-btn"
        onClick={handleSubmit}
      >
        Add Workout
      </motion.button>
    </ReactModal>
  );
};