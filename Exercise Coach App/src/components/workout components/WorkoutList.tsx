// import React, { useState } from "react";
// import ReactModal from "react-modal";
// import { useWorkout } from "../../hooks/useWorkout";
// import { motion } from "framer-motion";
// import { ExerciseTitleModal } from "./Modals/ExerciseTitleModal";
// import "./WorkoutList.scss";

// ReactModal.setAppElement("#root");

// const WorkoutsList: React.FC = () => {
//   const { workouts, error, addSetToExercise } = useWorkout();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleSetCompletion = async (
//     workoutId: string,
//     exerciseIndex: number,
//     setIndex: number,
//     completed: boolean
//   ) => {
//     try {
//       const workout = workouts.find((w) => w._id === workoutId);
//       if (workout) {
//         const set = {
//           ...workout.exercises[exerciseIndex].sets[setIndex],
//           completed,
//         };
//         await addSetToExercise(workoutId, exerciseIndex, set);
//       }
//     } catch (error) {
//       console.error("Error updating set completion:", error);
//      }
//   };

//   return (
//     <div className="workouts-list">
//       {error && <p className="error-message">{error}</p>}
//       {workouts.length > 0 ? (
//         <ul>
//           {workouts.map((workout) => (
//             <h4 key={workout._id}>
//               <h1>{workout.title}</h1>
//               <div className="exercise-lists-container">
//                 {workout.exercises.map((exercise, exerciseIndex) => (
//                   <div key={exerciseIndex} className="exercise-card">
//                     <h2>{exercise.exercise.name}</h2>
//                     <table className="exercise-table">
//                       <thead>
//                         <tr>
//                           <th>Set</th>
//                           <th>kg</th>
//                           <th>Reps</th>
//                           <th>RPE</th>
//                           <th>Done</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {exercise.sets.map((set, setIndex) => (
//                           <tr key={setIndex}>
//                             <td>{setIndex + 1}</td>
//                             <td>{set.weight}</td>
//                             <td>{set.reps}</td>
//                             <td>{set.rpe}</td>
//                             <td>
//                               <input
//                                 type="checkbox"
//                                 checked={set.completed}
//                                 onChange={() =>
//                                   handleSetCompletion(
//                                     workout._id,
//                                     exerciseIndex,
//                                     setIndex,
//                                     !set.completed
//                                   )
//                                 }
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ))}
//               </div>
//             </h4>
//           ))}
//         </ul>
//       ) : (
//         <div className="workout-list-empty">
//           <h2>No workouts</h2>
//           <motion.button
//             className="add-workout-button"
//             onClick={handleOpenModal}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             Add Workout
//           </motion.button>
//         </div>
//       )}
//       <ExerciseTitleModal isOpen={isModalOpen} onClose={handleCloseModal} />
//     </div>
//   );
// };

// export default WorkoutsList;
