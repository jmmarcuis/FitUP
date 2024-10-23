/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Modal from "react-modal";
import { useExerciseSearch } from "../../hooks/useExerciseSearch";
import { ExerciseDetailsModal } from "./ExerciseDetails";
import "./ExerciseSearchModal.scss";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ExerciseDetails {
  id: number;
  name: string;
  description: string;
  category: string;
  muscles: string[];
  equipment: string[];
  images: string | null;
}

interface ExerciseSearchModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  workoutId: string;
  onExerciseAdded: (exerciseId: number) => void;  
}

export const ExerciseSearchModal: React.FC<ExerciseSearchModalProps> = ({
  isOpen,
  onRequestClose,
  onExerciseAdded,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseDetails | null>(null);
  const { exercises, loading, error, searchExercises, getExerciseDetails } =
    useExerciseSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchExercises(searchTerm);
  };

  const handleExerciseSelect = async (id: number) => {
    try {
      const details = await getExerciseDetails(id);
      const formattedDetails: ExerciseDetails = {
        id: details.id,
        images: details.images.length > 0 ? details.images[0].image : null,
        name: details.name,
        description: details.description.replace(/<\/?[^>]+(>|$)/g, ""),
        category: details.category.name, // I DONT CARE FUCK YOU!
        muscles: details.muscles.map((m: any) => m.name_en || m.name),
        equipment: details.equipment.map((e: any) => e.name),
      };
      setSelectedExercise(formattedDetails);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Exercise Search Modal"
      className="exercise-search-modal"
      overlayClassName="modal-overlay"
    >
      <div className="flex">
        <h2>Search Exercises</h2>
        <Icon onClick={onRequestClose} icon="material-symbols:close" />
      </div>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter exercise name"
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="exercise-list">
        {exercises.map((exercise) => (
          <li key={exercise.data.id}>
            <div className="exercise-image">
              {exercise.data.image ? (
                <img
                  src={`https://wger.de${exercise.data.image}`}
                  alt={exercise.value}
                />
              ) : (
                <div className="placeholder-image">No image</div>
              )}
            </div>
            <div className="exercise-info">
              <span className="exercise-name">{exercise.value}</span>
              <span className="exercise-category">
                {exercise.data.category}
              </span>
            </div>
            <Icon
              icon="mdi:information"
              onClick={() => handleExerciseSelect(exercise.data.id)}
            />
          </li>
        ))}
      </ul>
      {selectedExercise && (
        <ExerciseDetailsModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onRequestClose={() => setSelectedExercise(null)}
          onExerciseAdded={onExerciseAdded}
        />
      )}
    </Modal>
  );
};
