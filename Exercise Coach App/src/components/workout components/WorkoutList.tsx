import React, { useState, useEffect } from "react";
import "./WorkoutList.scss";
import { Workout } from "../../Types/Workout";
import { ExerciseSearchModal } from "../Modals/ExerciseSearchModal";
import useAddExerciseToWorkout from "../../hooks/useAddExerciseToWorkout";
import { Icon } from "@iconify/react/dist/iconify.js";

interface WorkoutsListProps {
  workout: Workout | null;
}

const WorkoutsList: React.FC<WorkoutsListProps> = ({ workout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localWorkout, setLocalWorkout] = useState<Workout | null>(workout);
  const { addExerciseToWorkout, loading, error } = useAddExerciseToWorkout();

  useEffect(() => {
    setLocalWorkout(workout);
  }, [workout]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleExerciseAdded = async (exerciseId: number, initialSets: number) => {
    if (localWorkout && localWorkout._id) {
      try {
        const updatedWorkout = await addExerciseToWorkout(localWorkout._id, { exerciseId, initialSets });
        setLocalWorkout(updatedWorkout);
        closeModal();
      } catch (err) {
        console.error("Failed to add exercise:", err);
      }
    }
  };

  const handleAddSet = (exerciseIndex: number) => {
    if (localWorkout) {
      const updatedWorkout = { ...localWorkout };
      updatedWorkout.exercises[exerciseIndex].sets.push({ weight: 0, reps: 0, RPE: 0 });
      setLocalWorkout(updatedWorkout);
    }
  };

  const handleDeleteExercise = (exerciseIndex: number) => {
    if (localWorkout) {
      const updatedWorkout = { ...localWorkout };
      updatedWorkout.exercises.splice(exerciseIndex, 1);
      setLocalWorkout(updatedWorkout);
    }
  };

  const handleInputChange = (exerciseIndex: number, setIndex: number, field: string, value: number) => {
    if (localWorkout) {
      const updatedWorkout = { ...localWorkout };
      updatedWorkout.exercises[exerciseIndex].sets[setIndex][field] = value;
      setLocalWorkout(updatedWorkout);
    }
  };

  if (!localWorkout) {
    return (
      <div className="workout-list-empty">
        <h2>No workout selected</h2>
        <button className="add-workout-button" onClick={openModal}>Create Workout</button>
      </div>
    );
  }

  return (
    <>
      <div className="workouts-list">
        <div className="exercise-lists-container">
          <div className="exercise-card">
            <div className="workout-flex">
              <div className="workout-left">
                <h2>
                  Workout Title: <span>{localWorkout.name || 'Untitled'}</span>
                </h2>
                <h3>
                  Client Name:{" "}
                  <span>
                    {localWorkout.collaboration?.client?.firstName || ''}{" "}
                    {localWorkout.collaboration?.client?.lastName || ''}
                  </span>
                </h3>
              </div>
              <div className="workout-right">
                <button onClick={openModal}>
                  <Icon icon="material-symbols:add" />
                  Add Exercise
                </button>
              </div>
            </div>
            {localWorkout.exercises.map((exercise, index) => (
              <div key={index} className="exercise-item">
                <div className="list-flex">
                  <h4>{exercise.name || `Exercise ${index + 1}`}</h4>
                  <button className="delete-button" onClick={() => handleDeleteExercise(index)}>
                    <Icon icon="material-symbols:delete" />
                  </button>
                </div>
                <table className="exercise-table">
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>kg</th>
                      <th>Reps</th>
                      <th>RPE</th>
                     </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIndex) => (
                      <tr key={setIndex}>
                        <td>{setIndex + 1}</td>
                        <td>
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleInputChange(index, setIndex, 'weight', Number(e.target.value))}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => handleInputChange(index, setIndex, 'reps', Number(e.target.value))}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={set.RPE}
                            onChange={(e) => handleInputChange(index, setIndex, 'RPE', Number(e.target.value))}
                          />
                        </td>
                         
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="add-set-button" onClick={() => handleAddSet(index)}>
                  <Icon icon="material-symbols:add" />
                  Add Set
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {localWorkout._id && (
        <ExerciseSearchModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          workoutId={localWorkout._id}
          onExerciseAdded={handleExerciseAdded}
        />
      )}
      {loading && <p className="loading">Adding exercise...</p>}
      {error && <p className="error">{error}</p>}
    </>
  );
};

export default WorkoutsList;