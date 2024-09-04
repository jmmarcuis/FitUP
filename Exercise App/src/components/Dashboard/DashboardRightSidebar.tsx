import React from "react";
import { useAuth } from "../../hooks/useAuth";
import "./DashboardRightSidebar.scss";

const DashboardRightSidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="dashboard-right-sidebar">
      <div className="user-profile">
        <img src={user?.profilePicture} alt="Profile" />
        <div className="user-profile-flex"><h3>
          {user?.firstName} {user?.lastName}
        </h3>
        <p>{user?.email}</p></div>
        
      </div>

      <div className="user-details">
        <div className="user-detail">
          <h5>{user?.weight} <span className="unit">kg</span></h5>
          <p>Weight</p>
        </div>
        <div className="user-detail">
          <h5>{user?.height} <span className="unit">cm</span></h5>
          <p>Height</p>
        </div>
        <div className="user-detail">
          <h5>21 <span className="unit">yrs</span></h5>
          <p>Age</p>
        </div>
      </div>

      <div className="current-workout">
        <h4>Current Workout</h4>
      </div>

      <div className="scheduled-workouts">
        <h4>Scheduled Workouts</h4>
      </div>
    </aside>
  );
};

export default DashboardRightSidebar;
