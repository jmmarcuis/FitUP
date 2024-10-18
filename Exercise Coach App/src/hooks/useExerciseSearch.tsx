import { useState, useCallback } from 'react';
import axios from 'axios';

interface ExerciseData {
  id: number;
  base_id: number;
  name: string;
  category: string;
  image: string;
  image_thumbnail: string;
}

interface Exercise {
  value: string;
  data: ExerciseData;
}

interface ExerciseDetails {
  id: number;
  name: string;
  description: string;
  category: string;
  muscles: string[];
  equipment: string[];
  images: { image: string; is_main: boolean }[];  
}

interface UseExerciseSearchResult {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  searchExercises: (term: string, language?: string) => Promise<void>;
  getExerciseDetails: (id: number) => Promise<ExerciseDetails>;
}

export const useExerciseSearch = (): UseExerciseSearchResult => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchExercises = useCallback(async (term: string, language: string = 'en') => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/exercise/search', {
        params: { term, language }
      });
      setExercises(response.data);
    } catch (err) {
      setError('Failed to search exercises');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getExerciseDetails = useCallback(async (id: number): Promise<ExerciseDetails> => {
    try {
      const response = await axios.get(`http://localhost:5000/exercise/${id}`);
      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch exercise details');
    }
  }, []);

  return { exercises, loading, error, searchExercises, getExerciseDetails };
};
