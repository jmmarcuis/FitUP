import React from "react";
import { useAuth } from "../../hooks/useAuth";
import WorkoutCard from "../Cards/RightSidebar/WorkoutCard";
import ScheduleCard from "../Cards/RightSidebar/ScheduleCard";
import TrainerCard from "../Cards/RightSidebar/TrainerCard";
import "./DashboardRightSidebar.scss";
import coachImage from "../../assets/TrainerImages/coach-2.jpg";
import benchpressImage from "../../assets/WorkoutImages/benchpress.jpeg";

const DashboardRightSidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="dashboard-right-sidebar">
      <div className="user-profile">
        {/*Remove the coachImage when the real img is available :D*/}
        <img src={user?.profilePicture || coachImage} alt="Profile" />
        <div className="user-profile-flex">
          <h3>
            {user?.firstName} {user?.lastName}
          </h3>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="user-details">
        <div className="user-detail">
          <h5>
            {user?.weight} <span className="unit">kg</span>
          </h5>
          <p>Weight</p>
        </div>
        <div className="user-detail">
          <h5>
            {user?.height} <span className="unit">cm</span>
          </h5>
          <p>Height</p>
        </div>
        <div className="user-detail">
          <h5>
            21 <span className="unit">yrs</span>
          </h5>
          <p>Age</p>
        </div>
      </div>

      <WorkoutCard
        title="Your Workout for Today"
        exercises={[
          { name: "Squats", sets: 3, reps: 12, image: benchpressImage },
          {
            name: "Bench Press",
            sets: 3,
            reps: 10,
            image: benchpressImage,
          },
          {
            name: "Deadlift",
            sets: 3,
            reps: 8,
            image: benchpressImage,
          },
        ]}
      />

      <ScheduleCard
        title="Scheduled Workouts"
        schedules={[
          {
            name: "Push Day",
            date: "22 Mar",
            image: benchpressImage,
          },
          {
            name: "Pull Day",
            date: "23 Mar",
            image: benchpressImage,
          },
        ]}
      />

      <TrainerCard
        title="Your Fitness Trainer"
        trainer={{
          name: "Kyriakos Kapakoulak",
          role: "Strongman Instructor",
          contact: "09xx xxxx xxxx",
          profilePicture: coachImage,
        }}
      />
    </aside>
  );
};

export default DashboardRightSidebar;
