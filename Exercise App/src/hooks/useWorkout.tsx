import { useState } from 'react';
import * as workoutService from '../services/workoutService';

export const useWorkout = () => {
  const [workouts, setWorkouts] = useState<workoutService.Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWorkouts = async () => {
    setLoading(true);
    try {
      const fetchedWorkouts = await workoutService.getWorkouts();
      setWorkouts(fetchedWorkouts);
    } catch (err) {
      setError('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutById = async (id: string) => {
    setLoading(true);
    try {
      return await workoutService.getWorkoutById(id);
    } catch (err) {
      setError('Failed to fetch workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (workoutData: Omit<workoutService.Workout, 'id'>) => {
    setLoading(true);
    try {
      const newWorkout = await workoutService.createWorkout(workoutData);
      setWorkouts([...workouts, newWorkout]);
    } catch (err) {
      setError('Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  const updateWorkout = async (id: string, workoutData: Partial<workoutService.Workout>) => {
    setLoading(true);
    try {
      const updatedWorkout = await workoutService.updateWorkout(id, workoutData);
      setWorkouts(workouts.map(w => w.id === id ? updatedWorkout : w));
    } catch (err) {
      setError('Failed to update workout');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    setLoading(true);
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (err) {
      setError('Failed to delete workout');
    } finally {
      setLoading(false);
    }
  };

  const addExerciseToWorkout = async (workoutId: string, exerciseData: Omit<workoutService.Exercise, 'id'>) => {
    setLoading(true);
    try {
      const updatedWorkout = await workoutService.addExerciseToWorkout(workoutId, exerciseData);
      setWorkouts(workouts.map(w => w.id === workoutId ? updatedWorkout : w));
    } catch (err) {
      setError('Failed to add exercise to workout');
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseInWorkout = async (workoutId: string, exerciseId: string, exerciseData: Partial<workoutService.Exercise>) => {
    setLoading(true);
    try {
      const updatedWorkout = await workoutService.updateExerciseInWorkout(workoutId, exerciseId, exerciseData);
      setWorkouts(workouts.map(w => w.id === workoutId ? updatedWorkout : w));
    } catch (err) {
      setError('Failed to update exercise in workout');
    } finally {
      setLoading(false);
    }
  };

  const removeExerciseFromWorkout = async (workoutId: string, exerciseId: string) => {
    setLoading(true);
    try {
      const updatedWorkout = await workoutService.removeExerciseFromWorkout(workoutId, exerciseId);
      setWorkouts(workouts.map(w => w.id === workoutId ? updatedWorkout : w));
    } catch (err) {
      setError('Failed to remove exercise from workout');
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutsByDateRange = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      return await workoutService.getWorkoutsByDateRange(startDate, endDate);
    } catch (err) {
      setError('Failed to fetch workouts by date range');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    workouts,
    loading,
    error,
    getWorkouts,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    updateExerciseInWorkout,
    removeExerciseFromWorkout,
    getWorkoutsByDateRange,
  };
};