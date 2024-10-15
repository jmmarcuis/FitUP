import React, { useRef, useEffect, useState } from "react";
import { useSearch } from "../../../hooks/useSearch";
import { useWorkout } from "../../../hooks/useWorkout";
import { useAuth } from "../../../hooks/useAuth";
import { Modal } from "./ExerciseInfoModal";
import { Exercise } from "../../../Types/Exercise";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import ReactModal from "react-modal";
import "./SearchExerciseModal.scss";

ReactModal.setAppElement("#root");

interface SearchExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutId: string;
}

export const SearchExerciseModal: React.FC<SearchExerciseModalProps> = ({
  isOpen,
  onClose,
  workoutId,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    isActive,
    setIsActive,
    clearResults,
  } = useSearch();
  const { isAuthenticated } = useAuth();
  const { addExerciseToWorkout } = useWorkout();
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsActive]);

  if (!isAuthenticated) {
    return <div>Please log in to use the search feature.</div>;
  }

  const handleInputFocus = () => setIsActive(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      clearResults();
    }
  };

  const handleExerciseClick = (exercise: Exercise) => {
    console.log("Selected exercise:", exercise); // Added for debugging
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleAddWorkout = async (exerciseId: string, sets: number, reps: number, weight: number, rpe: number) => {
    try {
      console.log(`Adding exercise: ${exerciseId} to workout: ${workoutId}`);
      await addExerciseToWorkout(workoutId, exerciseId);
      setIsModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Failed to add exercise to workout:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Workout"
      className="workout-search-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-flex">
        <h2>Add Exercise</h2>
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={onClose}
        >
          <Icon icon="mdi:close" />
        </motion.div>
      </div>
      <div className="search-bar" ref={searchRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search exercises..."
        />
        {isActive && (results.length > 0 || loading || error) && (
          <div className="results">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {results.length > 0 && (
              <ul>
                {results.map((exercise, index) => (
                  <div className="result-flex" key={index}>
                    <li>{exercise.name}</li>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon
                        onClick={() => handleExerciseClick(exercise)}
                        icon="mdi:information-outline"
                      />
                    </motion.div>
                  </div>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        exercise={selectedExercise}
        onAddWorkout={handleAddWorkout}
      />
    </ReactModal>
  );
};