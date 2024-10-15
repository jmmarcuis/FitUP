// import React, { useState, useEffect } from "react";
// import ReactModal from "react-modal";
//  import { getGreeting } from "../Utilities/Greeting";
// //import Notification from "../common/Notification";
// //import { SearchExerciseModal } from "../workout components/Modals/SearchbarExercise";
// //import { useWorkout } from "../../hooks/useWorkout";
// //import { Workout } from "../../Types/Workout";
// import CoachModal from "../Modals/CoachModals/CoachModal";
// import mockCoaches from "../../mocks/mockCoaches";
// import mockWorkouts from "../../mocks/mockWorkouts";
// import "./Workouts.scss";

// ReactModal.setAppElement("#root");

// const Workouts: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   //uncomment ONLY if the real workouts data is available
//   //const { workouts, selectedDate } = useWorkout();
//   //const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

//   // using mock workouts instead of fetching from backend
//   const [workouts] = useState(mockWorkouts);
//   const [currentWorkout, setCurrentWorkout] = useState(workouts[0]);
//   // mock date for demonstration purposes
//   const selectedDate = new Date();

//   // finds workout for selected date
//   useEffect(() => {
//     const workoutForSelectedDate = workouts.find(
//       (workout) =>
//         new Date(workout.date).toDateString() === selectedDate.toDateString()
//     );
//     setCurrentWorkout(workoutForSelectedDate || null);
//   }, [workouts, selectedDate]);

//   // opening and closing modals
//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   // set header data
//   const greetingMessage = getGreeting();
//   const welcomeMessage = "Welcome Back 🎉";
//   const handleShowModal = () => {
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="workouts-container">

//       <div className="workout-flex">
//         <Calendar />

//         {/*<WorkoutsList*/}
//         <WorkoutsList workouts={workouts} />
//       </div>

//       <CoachModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         coach={mockCoaches}
//         onSelectTrainer={(trainer) => {
//           console.log("Selected Trainer:", trainer);
//           handleCloseModal();
//         }}
//       />
//     </div>
//   );
// };

// export default Workouts;
