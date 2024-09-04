import React, { useState } from "react";
import ReactModal from "react-modal";
import { useWorkout } from "../../../hooks/useWorkout";
import { format } from 'date-fns';
import "../Modals/ExerciseTitleModal.scss"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseTitleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedDate, addWorkout } = useWorkout();
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await addWorkout(title);
      setTitle("");
      onClose();
    }
  };

  return (
    <ReactModal
      className="exercise-title-modal-content"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <h2>Add Workout Title</h2>
      <h4>{format(selectedDate, 'MMMM d, yyyy')}</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter workout title"
        />
        <button type="submit">Add Workout</button>
      </form>
      <button onClick={onClose}>Close</button>
    </ReactModal>
  );
};