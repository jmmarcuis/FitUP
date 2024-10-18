import React, { useState } from "react";
import "./DashboardHome.scss";
import useWorkoutsByDate from "../../hooks/useWorkoutsByDate";
import useSelectedWorkout, { Workout } from "../../hooks/useSelectedWorkout";
import useCoachDetails from "../../hooks/useCoachDetails";
import { BarLoader } from "react-spinners";
import { getGreeting } from "../Utilities/Greeting";
import { Icon } from "@iconify/react";
import { ClientListModal } from "../Modals/DashboardModals/ClientListModal";
import { ActiveClient } from "../../Types/ActiveClient";
import CreateWorkoutModal from "../Modals/DashboardModals/CreateWorkoutModal";
import WorkoutsList from "../workout components/WorkoutList";
import { WorkoutListbyDateModal } from "../Modals/DashboardModals/WorkoutListbyDateModal";

  const DashboardHome: React.FC = () => {
  const { coachDetails, loading, error } = useCoachDetails();
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
      />
      {selectedClient && (
        <CreateWorkoutModal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default DashboardHome;
