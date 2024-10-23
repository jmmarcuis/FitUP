import React, { useState, useEffect } from "react";
import "./WorkoutList.scss";
import { Workout } from "../../Types/Workout";
import { ExerciseSearchModal } from "../Modals/ExerciseSearchModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmationModal } from "../Modals/ConfirmationModal";
import { SetDetailModal } from "../Modals/SetDetailModal";
// Workout Management Hooks
import useAddExerciseToWorkout from "../../hooks/useAddExerciseToWorkout";
import { useAddSetToExercise } from "../../hooks/Workout Management Hooks/useAddSetToExercise";
import useDeleteExerciseFromWorkout from "../../hooks/Workout Management Hooks/useDeleteExerciseFromWorkout";
import useDeleteSetFromExercise from "../../hooks/Workout Management Hooks/useDeleteSetFromExercise";
import useUpdateSetInExercise from "../../hooks/Workout Management Hooks/useUpdateSetInExercise";

interface WorkoutsListProps {
  workout: Workout | null;
}

const WorkoutsList: React.FC<WorkoutsListProps> = ({ workout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localWorkout, setLocalWorkout] = useState<Workout | null>(workout);

  const [setDetailModal, setSetDetailModal] = useState<{
    isOpen: boolean;
    exerciseId: string | null;
    setIndex: number | null;
    fieldName: string;
    initialValue: number;
  }>({
    isOpen: false,
    exerciseId: null,
    setIndex: null,
    fieldName: "",
    initialValue: 0,
  });

  const handleSetFieldClick = (
    exerciseId: string,
    setIndex: number,
    fieldName: string,
    initialValue: number
  ) => {
    setSetDetailModal({
      isOpen: true,
      exerciseId,
      setIndex,
      fieldName,
      initialValue,
    });
  };

  // Initialize all hooks
  const { addExerciseToWorkout, loading: addExerciseLoading } =
    useAddExerciseToWorkout();
  const { addSetToExercise, loading: addSetLoading } = useAddSetToExercise();
  const { deleteExerciseFromWorkout, loading: deleteExerciseLoading } =
    useDeleteExerciseFromWorkout();
  const { deleteSetFromExercise, loading: deleteSetLoading } =
    useDeleteSetFromExercise();
  const { updateSetInExercise, loading: updateSetLoading } =
    useUpdateSetInExercise();

  const [deleteExerciseConfirmation, setDeleteExerciseConfirmation] = useState<{
    isOpen: boolean;
    exerciseId: string | null;
  }>({ isOpen: false, exerciseId: null });

  const [deleteSetConfirmation, setDeleteSetConfirmation] = useState<{
    isOpen: boolean;
    exerciseId: string | null;
    setIndex: number | null;
  }>({ isOpen: false, exerciseId: null, setIndex: null });

  useEffect(() => {
    setLocalWorkout(workout);
  }, [workout]);

  const handleDeleteExerciseClick = (exerciseId: string) => {
    setDeleteExerciseConfirmation({ isOpen: true, exerciseId });
  };

  const handleDeleteSetClick = (exerciseId: string, setIndex: number) => {
    setDeleteSetConfirmation({ isOpen: true, exerciseId, setIndex });
  };

  // Handle adding exercise
  const handleExerciseAdded = async (exerciseId: number) => {
    if (localWorkout && localWorkout._id) {
      try {
        const updatedWorkout = await addExerciseToWorkout(localWorkout._id, {
          exerciseId,
          initialSets: 1,
        });
        setLocalWorkout(updatedWorkout);
        closeModal();
        toast.success("Exercise added successfully!");
      } catch (err) {
        toast.error("Failed to add exercise");
        console.error("Failed to add exercise:", err);
      }
    }
  };

  // Handle adding set
  const handleAddSet = async (exerciseId: string) => {
    if (!localWorkout?._id) return;

    try {
      // Change to use the MongoDB-generated _id of the exercise
      const updatedWorkout = await addSetToExercise(
        localWorkout._id,
        exerciseId
      );
      setLocalWorkout(updatedWorkout);
      toast.success("Set added successfully!");
    } catch (err) {
      toast.error("Failed to add set");
      console.error("Failed to add set:", err);
    }
  };

  // Handle deleting exercise
  const handleDeleteExercise = async (exerciseId: string) => {
    if (!localWorkout?._id) return;

    try {
      const updatedWorkout = await deleteExerciseFromWorkout(
        localWorkout._id,
        exerciseId
      );
      setLocalWorkout(updatedWorkout);
      toast.success("Exercise deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete exercise");
      console.error("Failed to delete exercise:", err);
    } finally {
      setDeleteExerciseConfirmation({ isOpen: false, exerciseId: null });
    }
  };

  // Handle deleting set
  const handleDeleteSet = async (exerciseId: string, setIndex: number) => {
    if (!localWorkout?._id) return;

    try {
      const updatedWorkout = await deleteSetFromExercise(
        localWorkout._id,
        exerciseId,
        setIndex
      );
      setLocalWorkout(updatedWorkout);
      toast.success("Set deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete set");
      console.error("Failed to delete set:", err);
    } finally {
      setDeleteSetConfirmation({
        isOpen: false,
        exerciseId: null,
        setIndex: null,
      });
    }
  };

  // Handle updating set
  const handleUpdateSet = async (value: number) => {
    if (
      !localWorkout?._id ||
      !setDetailModal.exerciseId ||
      setDetailModal.setIndex === null
    )
      return;

    try {
      const setData = {
        [setDetailModal.fieldName.toLowerCase()]: value,
      };

      const updatedWorkout = await updateSetInExercise(
        localWorkout._id,
        setDetailModal.exerciseId,
        setDetailModal.setIndex,
        setData
      );
      setLocalWorkout(updatedWorkout);
      toast.success("Set updated successfully!");
    } catch (err) {
      toast.error("Failed to update set");
      console.error("Failed to update set:", err);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!localWorkout) {
    return (
      <div className="workout-list-empty">
        <h2>No workout selected</h2>
        <button className="add-workout-button" onClick={openModal}>
          Create Workout
        </button>
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
                  Workout Title: <span>{localWorkout.name || "Untitled"}</span>
                </h2>
                <h3>
                  Client Name:{" "}
                  <span>
                    {localWorkout.collaboration?.client?.firstName || ""}{" "}
                    {localWorkout.collaboration?.client?.lastName || ""}
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
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteExerciseClick(exercise._id)}
                  >
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets
                      .filter((set) => set !== null)
                      .map((set, setIndex) => (
                        <tr key={setIndex}>
                          <td>{setIndex + 1}</td>
                          <td>
                            <input
                              type="number"
                              value={set?.weight ?? 0}
                              readOnly
                              onClick={() =>
                                handleSetFieldClick(
                                  exercise._id,
                                  setIndex,
                                  "weight",
                                  set?.weight ?? 0
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={set?.reps ?? 0}
                              readOnly
                              onClick={() =>
                                handleSetFieldClick(
                                  exercise._id,
                                  setIndex,
                                  "reps",
                                  set?.reps ?? 0
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={set?.RPE ?? 0}
                              readOnly
                              onClick={() =>
                                handleSetFieldClick(
                                  exercise._id,
                                  setIndex,
                                  "RPE",
                                  set?.RPE ?? 0
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="button"
                              onClick={() =>
                                handleDeleteSetClick(exercise._id, setIndex)
                              }
                            >
                              <Icon icon="material-symbols:delete" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <button
                  className="add-set-button"
                  onClick={() => handleAddSet(exercise._id)}
                >
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
      {(addExerciseLoading ||
        addSetLoading ||
        deleteExerciseLoading ||
        deleteSetLoading ||
        updateSetLoading) && <p className="loading">Processing...</p>}
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <ConfirmationModal
        isOpen={deleteExerciseConfirmation.isOpen}
        onClose={() =>
          setDeleteExerciseConfirmation({ isOpen: false, exerciseId: null })
        }
        onConfirm={() =>
          deleteExerciseConfirmation.exerciseId &&
          handleDeleteExercise(deleteExerciseConfirmation.exerciseId)
        }
        message="Are you sure you want to delete this exercise?"
      />

      <ConfirmationModal
        isOpen={deleteSetConfirmation.isOpen}
        onClose={() =>
          setDeleteSetConfirmation({
            isOpen: false,
            exerciseId: null,
            setIndex: null,
          })
        }
        onConfirm={() =>
          deleteSetConfirmation.exerciseId !== null &&
          deleteSetConfirmation.setIndex !== null &&
          handleDeleteSet(
            deleteSetConfirmation.exerciseId,
            deleteSetConfirmation.setIndex
          )
        }
        message="Are you sure you want to delete this set?"
      />

      <SetDetailModal
        isOpen={setDetailModal.isOpen}
        onClose={() =>
          setSetDetailModal({
            isOpen: false,
            exerciseId: null,
            setIndex: null,
            fieldName: "",
            initialValue: 0,
          })
        }
        onConfirm={handleUpdateSet}
        initialValue={setDetailModal.initialValue}
        fieldName={setDetailModal.fieldName}
      />
    </>
  );
};

export default WorkoutsList;
