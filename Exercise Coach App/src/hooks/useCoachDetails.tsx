import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface CoachDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  coachDescription:string;
  coachSpecialization:string;
}

const useCoachDetails = () => {
  const [coachDetails, setCoachDetails] = useState<CoachDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoachDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ coach: CoachDetails }>('http://localhost:5000/coach/coach-info', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCoachDetails(response.data.coach); // Access the nested coach object
      setError(null);
    } catch (err) {
      setError('Failed to fetch client details');
      setCoachDetails(null);
    } finally {
      setLoading(false);
    }
  }, []);
 

  // Fetch client details on initial mount
  useEffect(() => {
    fetchCoachDetails();
  }, [fetchCoachDetails]);

  return { coachDetails, loading, error, refetch: fetchCoachDetails }; // Return refetch function
};

export default useCoachDetails;
