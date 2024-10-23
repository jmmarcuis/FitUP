import React, { useState } from "react";
import ReactModal from "react-modal";
import { getGreeting } from "../Utilities/Greeting";
import { BarLoader } from "react-spinners";
import useClientDetails from "../../hooks/useClientDetails";
import useWorkout from "../../hooks/useWorkout";
import "./Workouts.scss";
import WorkoutsList from "../workout components/WorkoutList";

ReactModal.setAppElement("#root");

const Workouts: React.FC = () => {
  const greeting = getGreeting();
  const { clientDetails, loading: clientLoading, error: clientError } = useClientDetails();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  
  const { workout, loading: workoutLoading, error: workoutError } = useWorkout(selectedDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  return (
    <div className="workouts-container">
      <div className="dashboard-button-flex">
        <div className="dashboard-flex">
          <div>
            <h2>
              {clientLoading ? (
                <BarLoader color="#ffffff" loading={true} width={300} />
              ) : clientError || !clientDetails ? (
                <div className="error-message">
                  Failed to load Client details.
                </div>
              ) : (
                <h4>
                  {greeting} {clientDetails.firstName} {clientDetails.lastName}
                </h4>
              )}
            </h2>
          </div>
        </div>
        <div className="dashboard-flex">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </div>
      </div>
      <div className="workout-list-container">
        {workoutLoading ? (
          <BarLoader color="#ffffff" loading={true} width={300} />
        ) : workoutError ? (
          <div className="error-message">Failed to load workouts.</div>
        ) : (
          <WorkoutsList workouts={workout ? [workout] : []} />
        )}
      </div>
    </div>
  );
};

export default Workouts;