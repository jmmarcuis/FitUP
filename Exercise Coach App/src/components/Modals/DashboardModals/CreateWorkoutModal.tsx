import React, { useState } from "react";
import ReactModal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateWorkoutModal.scss";
import { ActiveClient } from "../../../Types/ActiveClient";
import { Icon } from "@iconify/react";
import useCreateWorkout from "../../../hooks/useCreateWorkout";  

interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ActiveClient;
}

const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ isOpen, onClose, client }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [description, setDescription] = useState("");
  const { createWorkout, loading, error } = useCreateWorkout(); // Use the hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const workoutData = {
        name: workoutName,
        description,
        date: workoutDate,
        collaborationId: client.collaborationId,
      };
      await createWorkout(workoutData);
      onClose(); // Close modal after successful submission
      // Optionally, you can add a success message or trigger a refresh of the workout list
    } catch (err) {
      // Error is handled by the hook, but you can add additional error handling here if needed
      console.error("Failed to create workout:", err);
    }
  };

  return (
    <ReactModal
      className="create-workout-modal"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
    >
      <div className="header-modal-flex">
        <h2>
          Creating a Workout for:{" "}
          <span>{client.firstName} {client.lastName}</span>
        </h2>
        <Icon icon="material-symbols:close" onClick={onClose} />
      </div>
      <form onSubmit={handleSubmit} className="workout-form-container">
        <div className="section-title">Workout Details</div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="workoutName">
              <Icon icon="mdi:account" />
              Workout Name
            </label>
            <input
              type="text"
              id="workoutName"
              name="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="workoutDate">
              <Icon icon="mdi:calendar" />
              Workout Date
            </label>
            <input
              type="date"
              id="workoutDate"
              name="workoutDate"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">
            <Icon icon="mdi:clipboard-text" />
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Workout"}
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default CreateWorkoutModal;