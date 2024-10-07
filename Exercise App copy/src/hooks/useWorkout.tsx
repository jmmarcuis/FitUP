import { useContext } from "react";
import { WorkoutContext, WorkoutContextType } from "../Context/WorkoutContext";
export const useWorkout = (): WorkoutContextType => {
  
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
