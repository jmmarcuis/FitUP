import { useState, useCallback } from 'react';
import axios from 'axios';
import { Workout } from '../Types/Workout';
const useWorkoutsByDate = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutsByDate = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const response = await axios.get<{ workouts: Workout[] }>(
        `http://localhost:5000/workout/by-date/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkouts(response.data.workouts);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred while fetching workouts');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { workouts, loading, error, fetchWorkoutsByDate };
};

export default useWorkoutsByDate;