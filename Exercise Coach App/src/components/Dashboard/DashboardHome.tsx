import React, { useState, useEffect } from "react";
import "./DashboardHome.scss";
//Utilities
import { getGreeting } from "../Utilities/Greeting";
// Hooks
import useWorkoutsByDate from "../../hooks/useWorkoutsByDate";
import useSelectedWorkout from "../../hooks/useSelectedWorkout";
import useCoachDetails from "../../hooks/useCoachDetails";
import useDeleteWorkout from "../../hooks/Workout Management Hooks/useDeleteWorkout";
//Third Party Libraries
import { BarLoader } from "react-spinners";
import { Icon } from "@iconify/react";
import { ToastContainer, toast } from "react-toastify";
//Interfaces
import { ActiveClient } from "../../Types/ActiveClient";
import { Workout } from "../../Types/Workout";
//Modals and Other Components
import CreateWorkoutModal from "../Modals/DashboardModals/CreateWorkoutModal";
import { ClientListModal } from "../Modals/DashboardModals/ClientListModal";
import { WorkoutListbyDateModal } from "../Modals/DashboardModals/WorkoutListbyDateModal";
import { ConfirmationModal } from "../Modals/ConfirmationModal";
import WorkoutsList from "../workout components/WorkoutList";

const DashboardHome: React.FC = () => {
  const { coachDetails, loading, error } = useCoachDetails();
  const { deleteWorkout, isDeleting, deleteError } = useDeleteWorkout();
  const {
    workouts,
    loading: workoutsLoading,
    error: workoutsError,
    fetchWorkoutsByDate,
  } = useWorkoutsByDate();
  const { selectedWorkout, setSelectedWorkout } = useSelectedWorkout();
  const greeting = getGreeting();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWorkoutListModalOpen, setIsWorkoutListOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ActiveClient | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openWorkoutListModal = () => {
    fetchWorkoutsByDate(selectedDate);
    setIsWorkoutListOpen(true);
  };
  const closeWorkoutListModal = () => setIsWorkoutListOpen(false);

  const handleClientSelect = (client: ActiveClient) => {
    setSelectedClient(client);
    setIsModalOpen(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout);
    closeWorkoutListModal();
  };

  useEffect(() => {
    fetchWorkoutsByDate(selectedDate);
  }, [selectedDate, fetchWorkoutsByDate]);

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkoutToDelete(workoutId);
    setIsConfirmationModalOpen(true);
  };

  const confirmDeleteWorkout = async () => {
    if (workoutToDelete) {
      const success = await deleteWorkout(workoutToDelete);
      if (success) {
        toast.success('Workout Deleted Sucessfully');
        fetchWorkoutsByDate(selectedDate);
        if (selectedWorkout?._id === workoutToDelete) {
          setSelectedWorkout(null);
        }
      }
    }
    setIsConfirmationModalOpen(false);
    setWorkoutToDelete(null);
  };

  return (
    <div className="dashboard-home-container">
      <div className="dashboard-button-flex">
        <div className="dashboard-flex">
          <div>
            <h2>
              {loading ? (
                <BarLoader color="#ffffff" loading={true} width={300} />
              ) : error || !coachDetails ? (
                <div className="error-message">
                  Failed to load Coach details.
                </div>
              ) : (
                <h4>
                  {greeting}
                  {coachDetails.firstName} {coachDetails.lastName}
                </h4>
              )}
            </h2>
            <p>Get an overview of your client progress.</p>
          </div>
        </div>
        <div className="dashboard-flex">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
          <button className="add-button" onClick={openWorkoutListModal}>
            <Icon icon="ic:baseline-people" />
            Workouts
            {workouts.length > 0 && (
              <span className="workout-count">({workouts.length})</span>
            )}
          </button>
          <button className="add-button" onClick={openModal}>
            <Icon icon="material-symbols:add" /> Create Workout
          </button>
        </div>
      </div>

      {workoutsLoading ? (
        <BarLoader color="#ffffff" loading={true} width={300} />
      ) : workoutsError ? (
        <div className="error-message">{workoutsError}</div>
      ) : (
        <WorkoutsList workout={selectedWorkout} />
      )}

      <ClientListModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onClientSelect={handleClientSelect}
      />
      <WorkoutListbyDateModal
        isOpen={isWorkoutListModalOpen}
        onClose={closeWorkoutListModal}
        workouts={workouts}
        selectedDate={selectedDate}
        onWorkoutSelect={handleWorkoutSelect}
        onDeleteWorkout={handleDeleteWorkout}
        isDeleting={isDeleting}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDeleteWorkout}
        message="Are you sure you want to delete this workout?"
      />
      {deleteError && <div className="error-message">{deleteError}</div>}

      {selectedClient && (
        <CreateWorkoutModal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
        />
      )}

      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
    </div>
  );
};

export default DashboardHome;
