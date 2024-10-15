import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ClientDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  age: number;
}

const useClientDetails = () => {
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientDetails = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get<ClientDetails>('http://localhost:5000/client/details', {
        headers: {
          Authorization: `Bearer ${token}` // Properly using backticks here
        }
      });

      setClientDetails(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching client details:', err);
      setError('Failed to fetch client details');
      setClientDetails(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);

  return { clientDetails, loading, error, refetch: fetchClientDetails };
};

export default useClientDetails;
