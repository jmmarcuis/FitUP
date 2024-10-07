import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { getGreeting } from "../Utilities/Greeting";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Notification from "../common/Notification";
import ToggleLightDarkSwitch from "../common/ToggleLightDarkSwitch";
import Calendar from "../workout components/Calendar";
import { SearchExerciseModal } from "../workout components/Modals/SearchbarExercise";
import WorkoutsList from "../workout components/WorkoutList";
import { useWorkout } from "../../hooks/useWorkout";
import { Workout } from "../../Types/Workout";
import "./Workouts.scss";

ReactModal.setAppElement("#root");

const Workouts: React.FC = () => {
  const [greeting, setGreeting] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { workouts, selectedDate } = useWorkout();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const workoutForSelectedDate = workouts.find(
      (workout) => new Date(workout.date).toDateString() === selectedDate.toDateString()
    );
    setCurrentWorkout(workoutForSelectedDate || null);
  }, [workouts, selectedDate]);

  useEffect(() => {
    const updateGreeting = () => {
      const newGreeting = getGreeting();
      setGreeting(newGreeting);
    };
    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="workouts-container">
      <div className="workout-flex-container">
        <div className="greeting-container">
          <h1>{greeting}</h1>
        </div>
        <div className="right-elements">
          <Notification />
          <ToggleLightDarkSwitch />
        </div>
      </div>
      <div className="workout-flex">
        <Calendar />
        {workouts.length > 0 && (
          <div className="workout-buttons">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleOpenModal}
            >
              Add Exercise
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon icon="material-symbols:timer" />
            </motion.button>
          </div>
        )}
      </div>
      <WorkoutsList />
      {currentWorkout && (
        <SearchExerciseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          workoutId={currentWorkout._id}
        />
      )}
    </div>
  );
};

export default Workouts;