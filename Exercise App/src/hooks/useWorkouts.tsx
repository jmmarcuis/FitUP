// hooks/useWorkouts.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Workout } from '../Types/Workout';

interface UseWorkoutsReturn {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  refetchWorkouts: () => Promise<void>;
}

const useWorkouts = (selectedDate: string): UseWorkoutsReturn => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(
        `http://localhost:5000/workout/by-date/${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setWorkouts(response.data.workouts);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch workouts');
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching workouts');
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return {
    workouts,
    loading,
    error,
    refetchWorkouts: fetchWorkouts
  };
};

export default useWorkouts;