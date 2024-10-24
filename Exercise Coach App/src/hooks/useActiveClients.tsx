import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

 

interface ActiveClient {
  collaborationId: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  clientImage: string;
  startDate: string;
}

interface ErrorResponse {
  message: string;
}

interface ApiResponse {
  message: string;
  activeClients: ActiveClient[];
}

const useActiveClients = () => {
  const [activeClients, setActiveClients] = useState<ActiveClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');
      
      const response = await axios.get<ApiResponse>(
        'http://localhost:5000/collab/coach/active-clients',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setActiveClients(response.data.activeClients);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || 'An error occurred while fetching active clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveClients();
  }, [fetchActiveClients]);

  const refetch = () => {
    fetchActiveClients();
  };

  return { activeClients, loading, error, refetch };
};

export default useActiveClients;