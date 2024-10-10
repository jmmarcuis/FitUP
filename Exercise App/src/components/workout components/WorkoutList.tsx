import React, { useState } from "react";
import ReactModal from "react-modal";
import { useWorkout } from "../../hooks/useWorkout";
//import { motion } from "framer-motion";
import { ExerciseTitleModal } from "./Modals/ExerciseTitleModal";
//import { Workout } from "../Dashboard/Workouts";
import WorkoutDetailsModal from "./WorkoutModals/WorkoutDetailsModal";
import "./WorkoutList.scss";
import { Icon } from "@iconify/react";
import { Exercise } from "../../mocks/mockWorkouts";

// props interface for predefined workouts for now
interface WorkoutsListProps {
  workouts: Workout[];
}

ReactModal.setAppElement("#root");

//The comments below are the original code
//Change it if the backend/real workout data is available
//const WorkoutsList: React.FC = () => {
const WorkoutsList: React.FC<WorkoutsListProps> = ({ workouts }) => {
  //const { workouts, error, addSetToExercise } = useWorkout();
  const { error, addSetToExercise } = useWorkout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWorkoutDetailsModalOpen, setIsWorkoutDetailsModalOpen] =
    useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSetCompletion = async (
    workoutId: string,
    exerciseIndex: number,
    setIndex: number,
    completed: boolean
  ) => {
    try {
      const workout = workouts.find((w) => w._id === workoutId);
      if (workout) {
        const set = {
          ...workout.exercises[exerciseIndex].sets[setIndex],
          completed,
        };
        await addSetToExercise(workoutId, exerciseIndex, set);
      }
    } catch (error) {
      console.error("Error updating set completion:", error);
    }
  };

  // u can delete this when doing the backend bit
  // this is temporary just for testing purposes for the FE
  const [completedSets, setCompletedSets] = useState<{
    [key: string]: boolean;
  }>({});
  const toggleSetCompletion = (
    workoutId: string,
    exerciseIndex: number,
    setIndex: number
  ) => {
    const key = `${workoutId}-${exerciseIndex}-${setIndex}`;
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // opens/closes workout details when user clicks info icon
  const handleOpenWorkoutDetails = (exercise: Exercise) => {
    setSelectedWorkout(exercise);
    setIsWorkoutDetailsModalOpen(true);
  };
  const handleCloseWorkoutDetails = () => {
    setIsWorkoutDetailsModalOpen(false);
    setSelectedWorkout(null); // Reset selected workout
  };

  

  return (
    <div className="workouts-main">
      <div className="workout-title-section">
        <p>Workout Title: Push Day</p>
        <p>Created By: Kyriakos Kapakoulak</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      {workouts.length > 0 ? (
        <ul>
          {workouts.map((workout) => (
            <h4 key={workout._id}>
              <div className="exercise-lists-container">
                {/* If the real workouts data is available, kindly
                remove the code below this comment and replace it with this instead:

                {workout.exercises.map((exercise, exerciseIndex) => (
                
                */}
                {workout.exercises.map(
                  (exercise: Exercise, exerciseIndex: number) => (
                    <div key={exerciseIndex} className="exercise-card">
                      <table className="exercise-table">
                        <thead>
                          <tr>
                            <td colSpan={4} className="exercise-title">
                              {exercise.exercise.name}
                            </td>
                            <td className="info-icon-container">
                              <Icon
                                icon="mdi:info"
                                onClick={
                                  () => handleOpenWorkoutDetails(exercise)
                                  //console.log(selectedWorkout.exercise.namee)
                                }
                                className="info-icon"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th>Set</th>
                            <th>kg</th>
                            <th>Reps</th>
                            <th>RPE</th>
                            <th>Done</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set, setIndex) => {
                            // for testing purposes, u can remove this
                            const key = `${workout._id}-${exerciseIndex}-${setIndex}`; // Define key here
                            return (
                              <tr key={setIndex}>
                                <td>{setIndex + 1}</td>
                                <td>{set.weight}</td>
                                <td>{set.reps}</td>
                                <td>{set.rpe}</td>
                                <td>
                                  <label className="checkbox-container">
                                    {/* replace the code below with this commented code
                                  if the backend for this bit is done :D
                                  kasi I used a temporary code lng muna below this 
                                  just to test the design/style, thx

                                  <input
                                  type="checkbox"
                                  checked={set.completed}
                                  onChange={() =>
                                    handleSetCompletion(
                                      workout._id,
                                      exerciseIndex,
                                      setIndex,
                                      !set.completed
                                    )
                                  }
                                /> */}
                                    <input
                                      type="checkbox"
                                      checked={completedSets[key] || false} // Use local state
                                      onChange={() =>
                                        toggleSetCompletion(
                                          workout._id,
                                          exerciseIndex,
                                          setIndex
                                        )
                                      }
                                    />
                                    <div
                                      className={`custom-checkbox ${
                                        completedSets[key] ? "checked" : ""
                                      }`}
                                    ></div>
                                  </label>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            </h4>
          ))}
        </ul>
      ) : (
        <div className="workout-list-empty">
          <h2>No workouts</h2>
        </div>
      )}
      <ExerciseTitleModal isOpen={isModalOpen} onClose={handleCloseModal} />
      {isWorkoutDetailsModalOpen && selectedWorkout && (
        <WorkoutDetailsModal
          image={selectedWorkout.exercise.image}
          name={selectedWorkout.exercise.name}
          description={selectedWorkout.exercise.description}
          onClose={handleCloseWorkoutDetails}
        />
      )}
    </div>
  );
};

export default WorkoutsList;
