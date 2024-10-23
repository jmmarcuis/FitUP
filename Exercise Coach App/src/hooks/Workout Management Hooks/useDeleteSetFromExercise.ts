import { useState } from 'react';
import axios from 'axios';

export const useDeleteSetFromExercise = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const deleteSetFromExercise = async (workoutId: string, exerciseId: string, setIndex: number) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');
  
        const response = await axios.delete(
          `http://localhost:5000/workout/${workoutId}/exercises/${exerciseId}/sets/${setIndex}`,
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
          setError(err.response?.data?.message || 'An error occurred while deleting the set');
        } else {
          setError('An unexpected error occurred');
        }
        throw err;
      }
    };
  
    return { deleteSetFromExercise, loading, error };
  };
  
  export default useDeleteSetFromExercise;
