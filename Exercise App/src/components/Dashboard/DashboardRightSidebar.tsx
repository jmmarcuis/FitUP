import React from "react";
import "./DashboardRightSidebar.scss";
import useClientDetails from "../../hooks/useClientDetails";
import useWorkout from "../../hooks/useWorkout";
import useAssignedCoach from "../../hooks/useAssignedCoach.tsx";  
import { BarLoader } from "react-spinners";

 


const DashboardRightSidebar: React.FC = () => {
  const { clientDetails, loading: clientLoading, error: clientError } = useClientDetails();
  const today = new Date().toISOString().split('T')[0];
  const { workout, loading: workoutLoading, error: workoutError } = useWorkout(today);
  const { coach, loading: coachLoading, error: coachError } = useAssignedCoach();

  return (
    <aside className="dashboard-right-sidebar">
      {clientLoading ? (
        <BarLoader color="#ffffff" loading={true} width={300} />
      ) : clientError ? (
        <div className="error-message">Failed to load client details.</div>
      ) : (
        <div className="user-profile">
          <img src={clientDetails?.profilePicture} alt="Profile" />
          <div className="user-profile-flex">
            <h3>
              {clientDetails?.firstName} {clientDetails?.lastName}
            </h3>
            <p>{clientDetails?.email}</p>
          </div>
        </div>
      )}

      <div className="user-details">
        {clientLoading ? (
          <BarLoader color="#ffffff" loading={true} width={300} />
        ) : clientError ? (
          <div className="error-message">Error loading user details.</div>
        ) : (
          <>
            <div className="user-detail">
              <h5>
                {clientDetails?.weight} <span className="unit">kg</span>
              </h5>
              <p>Weight</p>
            </div>
            <div className="user-detail">
              <h5>
                {clientDetails?.height} <span className="unit">cm</span>
              </h5>
              <p>Height</p>
            </div>
            <div className="user-detail">
              <h5>
                {clientDetails?.age} <span className="unit">yrs</span>
              </h5>
              <p>Age</p>
            </div>
          </>
        )}
      </div>

      <div className="current-workout">
        <h4>Your Workout for today</h4>
        {workoutLoading ? (
          <BarLoader color="#ffffff" loading={true} width={300} />
        ) : workoutError ? (
          <div className="error-message">Failed to load workout.</div>
        ) : workout ? (
          <div className="workout-preview">
     
            <div className="exercises-preview">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="exercise-preview-item">
                  <h4 className="exercise-name">{exercise.name}</h4>
                  <p className="exercise-sets">
                    {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-workout">No workout scheduled for today</p>
        )}
      </div>

      <div className="scheduled-workouts">
        <h4>Scheduled</h4>
        {/* You can add scheduled workouts here if needed */}
      </div>

      <div className="assigned-coach">
    <h4>Your Assigned Coach</h4>
    {coachLoading ? (
      <BarLoader color="#ffffff" loading={true} width={300} />
    ) : coachError ? (
      <div className="error-message">Failed to load coach details.</div>
    ) : coach ? (
      <div className="user-profile">
        <img src={coach.profilePicture} alt="Coach Profile" />
        <div className="user-profile-flex">
          <h3>
            {coach.firstName} {coach.lastName}
          </h3>
          <p>{coach.email}</p>
        </div>
      </div>
    ) : (
      <p>No coach assigned</p>
    )}
  </div>
    </aside>
  );
};

export default DashboardRightSidebar;