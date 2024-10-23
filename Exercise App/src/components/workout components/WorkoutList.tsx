// WorkoutList.tsx
import React, { useState } from "react";
import "./WorkoutList.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react/dist/iconify.js";
// import useExerciseDetails from "../../hooks/useExerciseDetails";
import ExerciseDetailsModal from "../Modals/ExerciseDetailsModal";
interface WorkoutSet {
  reps: number;
  weight: number;
  RPE: number;
}

interface Exercise {
  exerciseId: string; 
  name: string;
  sets: WorkoutSet[];
}

interface Coach {
  firstName: string;
  lastName: string;
  profilePicture: string;
}

interface Workout {
  _id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  collaboration: {
    coach: Coach;
    client: {
      firstName: string;
      lastName: string;
    };
  };
}

interface WorkoutsListProps {
  workouts: Workout[];
}

const WorkoutsList: React.FC<WorkoutsListProps> = ({ workouts }) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  );

  if (!workouts || workouts.length === 0) {
    return (
      <div className="workout-list-empty">
        <h2>No workouts found for this date</h2>
      </div>
    );
  }

  return (
    <>
      <div className="workouts-list">
        {workouts.map((workout) => (
          <div key={workout._id} className="exercise-lists-container">
            <div className="exercise-card">
              <div className="workout-header">
                <div className="workout-info">
                  <div className="workout-info-left">
                    <h2>
                      Workout Title:{" "}
                      <span>{workout.name || "Untitled Workout"}</span>{" "}
                    </h2>
                    <h2>
                      Created By:{" "}
                      <span>
                        {`${workout.collaboration.coach.firstName} ${workout.collaboration.coach.lastName}`}
                      </span>{" "}
                    </h2>
                  </div>
                  <div className="workout-info-right">
                    <button>
                      <Icon icon="material-symbols:timer-outline" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="exercises-container">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-item">
                    <div className="exercise-header">
                      <h3>{exercise.name || `Exercise ${index + 1}`}</h3>{" "}
                      <Icon
                        icon="mdi:information-outline"
                        onClick={() =>
                          setSelectedExerciseId(exercise.exerciseId)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div className="exercise-content">
                      <table className="exercise-table">
                        <thead>
                          <tr>
                            <th>Set</th>
                            <th>Weight (kg)</th>
                            <th>Reps</th>
                            <th>RPE</th>
                            <th>
                              <Icon icon="material-symbols:check-box" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets
                            .filter((set) => set !== null)
                            .map((set, setIndex) => (
                              <tr key={setIndex}>
                                <td className="set-number">{setIndex + 1}</td>
                                <td>
                                  <div className="value-display">
                                    {set?.weight ?? 0}
                                  </div>
                                </td>
                                <td>
                                  <div className="value-display">
                                    {set?.reps ?? 0}
                                  </div>
                                </td>
                                <td>
                                  <div className="value-display">
                                    {set?.RPE ?? 0}
                                  </div>
                                </td>
                                <td>
                                  <input type="checkbox" />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ExerciseDetailsModal
        exerciseId={selectedExerciseId}
        isOpen={!!selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
      />
      <ToastContainer />
    </>
  );
};

export default WorkoutsList;
