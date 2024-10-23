import { useState } from 'react';
import axios from 'axios';

export const useAddSetToExercise = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSetToExercise = async (workoutId: string, exerciseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      // Use exercise._id instead of the external `exerciseId`
      const response = await axios.post(
        `http://localhost:5000/workout/${workoutId}/exercises/${exerciseId}/sets`,
        {}, // The payload can be added here if needed (like set data)
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
        setError(err.response?.data?.message || 'An error occurred while adding the set');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  return { addSetToExercise, loading, error };
};
