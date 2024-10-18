import { useState } from 'react';
import axios from 'axios';

const useCreateWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWorkout = async (workoutData: {
    name: string;
    description: string;
    date: string;
    collaborationId: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const response = await axios.post(
        'http://localhost:5000/workout/',
        workoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred while creating the workout');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  return { createWorkout, loading, error };
};

export default useCreateWorkout;