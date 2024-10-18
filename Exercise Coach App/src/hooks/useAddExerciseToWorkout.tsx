import { useState } from 'react';
import axios from 'axios';

interface AddExerciseData {
  exerciseId: number;
  initialSets: number;
}

const useAddExerciseToWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExerciseToWorkout = async (workoutId: string, exerciseData: AddExerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');
      
      const response = await axios.post(
        `http://localhost:5000/workout/${workoutId}/exercises`,
        exerciseData,
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
        setError(err.response?.data?.message || 'An error occurred while adding the exercise');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  return { addExerciseToWorkout, loading, error };
};

export default useAddExerciseToWorkout;
