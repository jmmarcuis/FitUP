import { useState } from 'react';
import axios from 'axios';

export const useDeleteExerciseFromWorkout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const deleteExerciseFromWorkout = async (workoutId: string, exerciseId: string) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');
  
        const response = await axios.delete(
          `http://localhost:5000/workout/${workoutId}/exercises/${exerciseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        return response.data;
      } catch (err) {
        setLoading(false);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'An error occurred while deleting the exercise');
        } else {
          setError('An unexpected error occurred');
        }
        throw err;
      }
    };
  
    return { deleteExerciseFromWorkout, loading, error };
  };

  export default useDeleteExerciseFromWorkout;
