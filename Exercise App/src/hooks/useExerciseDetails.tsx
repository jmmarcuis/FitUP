// hooks/useExerciseDetails.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ExerciseDetails {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  muscles: Array<{
    id: number;
    name: string;
    is_front: boolean;
  }>;
  equipment: Array<{
    id: number;
    name: string;
  }>;
  images: Array<{
    id: number;
    image: string;
    is_main: boolean;
  }>;
}

interface UseExerciseDetailsResult {
  exerciseDetails: ExerciseDetails | null;
  loading: boolean;
  error: string | null;
}

const useExerciseDetails = (exerciseId: string | null): UseExerciseDetailsResult => {
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      if (!exerciseId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`https://wger.de/api/v2/exerciseinfo/${exerciseId}`);
        setExerciseDetails(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching exercise details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch exercise details');
        setExerciseDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetails();
  }, [exerciseId]);

  return { exerciseDetails, loading, error };
};

export default useExerciseDetails;