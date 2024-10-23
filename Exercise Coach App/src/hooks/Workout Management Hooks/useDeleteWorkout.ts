import { useState, useCallback } from 'react';
import axios from 'axios';
 
const useDeleteWorkout = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteWorkout = useCallback(async (workoutId: string) => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      await axios.delete(`http://localhost:5000/workout/${workoutId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Return true to indicate successful deletion
      return true;
     } catch (err) {
      if (axios.isAxiosError(err)) {
        setDeleteError(err.response?.data?.message || 'An error occurred while deleting the workout');
      } else {
        setDeleteError('An unexpected error occurred');
      }
      // Return false to indicate failed deletion
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { deleteWorkout, isDeleting, deleteError };
};

export default useDeleteWorkout;