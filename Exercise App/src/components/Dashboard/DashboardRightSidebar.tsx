import React from "react";
import "./DashboardRightSidebar.scss";
import useClientDetails from "../../hooks/useClientDetails";
import { BarLoader } from "react-spinners";

const DashboardRightSidebar: React.FC = () => {
  const { clientDetails, loading, error } = useClientDetails();

  return (
    <aside className="dashboard-right-sidebar">
      {loading ? (
          <BarLoader color="#ffffff" loading={true} width={300} />
        ) : error ? (
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
        {loading ? (
          <BarLoader color="#ffffff" loading={true} width={300} />
        ) : error ? (
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
      </div>
      <div className="scheduled-workouts">
        <h4>Scheduled</h4>
      </div>
    </aside>
  );
};

export default DashboardRightSidebar;
