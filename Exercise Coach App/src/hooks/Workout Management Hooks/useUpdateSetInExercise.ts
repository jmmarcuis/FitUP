import { useState } from 'react';
import axios from 'axios';


export const useUpdateSetInExercise = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const updateSetInExercise = async (
      workoutId: string, 
      exerciseId: string, 
      setIndex: number, 
      setData: { reps?: number; weight?: number; RPE?: number }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');
  
        const response = await axios.put(
          `http://localhost:5000/workout/${workoutId}/exercises/${exerciseId}/sets/${setIndex}`,
          setData,
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
          setError(err.response?.data?.message || 'An error occurred while updating the set');
        } else {
          setError('An unexpected error occurred');
        }
        throw err;
      }
    };
  
    return { updateSetInExercise, loading, error };
  };

  export default useUpdateSetInExercise;
