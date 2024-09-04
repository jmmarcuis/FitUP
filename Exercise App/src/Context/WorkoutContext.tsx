import React, { useState, useCallback, useContext } from 'react';
import { Workout, WorkoutExercise } from '../Types/Workout';
import { 
  fetchWorkoutsByDate, 
  createWorkout, 
  addExerciseToWorkout as addExerciseToWorkoutService,
  addSetToExercise as addSetToExerciseService
} from '../services/workoutService';

export interface WorkoutContextType {
  workouts: Workout[];
  selectedDate: Date;
  error: string | null;
  setSelectedDate: (date: Date) => void;
  fetchWorkouts: (date: Date) => Promise<void>;
  addWorkout: (title: string) => Promise<void>;
  addExerciseToWorkout: (
    workoutId: string,
    exerciseId: string
  ) => Promise<Workout>;
  addSetToExercise: (
    workoutId: string,
    exerciseIndex: number,
    set: WorkoutExercise['sets'][0]
  ) => Promise<Workout>;
}

export const WorkoutContext = React.createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async (date: Date) => {
    try {
      setError(null);
      const fetchedWorkouts = await fetchWorkoutsByDate(date);
      setWorkouts(fetchedWorkouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
      setError('Failed to fetch workouts. Please try again later.');
    }
  }, []);

  const addWorkout = useCallback(async (title: string) => {
    try {
      setError(null);
      const newWorkout = await createWorkout(title, selectedDate);
      setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
    } catch (error) {
      console.error('Error adding workout:', error);
      setError('Failed to add workout. Please try again later.');
    }
  }, [selectedDate]);

  const addExerciseToWorkout = useCallback(
    async (workoutId: string, exerciseId: string) => {
      try {
        setError(null);
        const updatedWorkout = await addExerciseToWorkoutService(workoutId, exerciseId);
        setWorkouts(prevWorkouts =>
          prevWorkouts.map(workout =>
            workout._id === updatedWorkout._id ? updatedWorkout : workout
          )
        );
        return updatedWorkout;
      } catch (error) {
        console.error('Error adding exercise to workout:', error);
        setError('Failed to add exercise to workout. Please try again later.');
        throw error;
      }
    },
    [setWorkouts, setError]
  );

  const addSetToExercise = useCallback(
    async (workoutId: string, exerciseIndex: number, set: WorkoutExercise['sets'][0]) => {
      try {
        setError(null);
        const updatedWorkout = await addSetToExerciseService(workoutId, exerciseIndex, set);
        setWorkouts(prevWorkouts =>
          prevWorkouts.map(workout =>
            workout._id === updatedWorkout._id ? updatedWorkout : workout
          )
        );
        return updatedWorkout;
      } catch (error) {
        console.error('Error adding set to exercise:', error);
        setError('Failed to add set to exercise. Please try again later.');
        throw error;
      }
    },
    [setWorkouts, setError]
  );

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        selectedDate,
        error,
        setSelectedDate,
        fetchWorkouts,
        addWorkout,
        addExerciseToWorkout,
        addSetToExercise,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};