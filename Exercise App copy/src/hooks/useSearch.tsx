// src/hooks/useSearch.ts
import { useState, useEffect, useCallback } from 'react';

import { useSearchContext } from '../Context/SearchContext';
import { useAuth } from './useAuth';
import { searchExercises } from '../services/searchExerciseService';
import { Exercise } from '../Types/Exercise';

export const useSearch = () => {
  const { searchTerm, setSearchTerm } = useSearchContext();
  const { isAuthenticated, user } = useAuth();
  const [results, setResults] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user || !searchTerm || !isActive) {
      clearResults();
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token found');
        }
        const data = await searchExercises(searchTerm, token);
        setResults(data);  // Now we're setting the full Exercise objects
      } catch (err) {
        setError('An error occurred while searching');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, isAuthenticated, user, isActive]);

  return { searchTerm, setSearchTerm, results, loading, error, isActive, setIsActive, clearResults };
};