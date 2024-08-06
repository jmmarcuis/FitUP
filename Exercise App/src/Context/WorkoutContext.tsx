import React, { createContext, useContext, ReactNode } from 'react';
import { useWorkout } from '../hooks/useWorkout';
import { Workout } from '../services/workoutService';


interface WorkoutContextType {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  getWorkouts: () => Promise<void>;
  getWorkoutById: (id: string) => Promise<Workout>;
  createWorkout: (workoutData: Omit<Workout, 'id'>) => Promise<void>;
  updateWorkout: (id: string, workoutData: Partial<Workout>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
 
  removeExerciseFromWorkout: (workoutId: string, exerciseId: string) => Promise<void>;
  getWorkoutsByDateRange: (startDate: string, endDate: string) => Promise<Workout[]>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const workoutHook = useWorkout();
  return (
    <WorkoutContext.Provider value={workoutHook}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
};