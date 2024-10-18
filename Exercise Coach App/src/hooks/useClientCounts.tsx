import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface ClientCounts {
  totalClients: number;
  activeClients: number;
  pendingClients: number;
}

interface ErrorResponse {
  message: string;
}

const useClientCounts = () => {
  const [clientCounts, setClientCounts] = useState<ClientCounts>({
    totalClients: 0,
    activeClients: 0,
    pendingClients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ totalClients: number; activeClients: number; pendingClients: number }>(
        'http://localhost:5000/collab/coach/clients-counts',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClientCounts({
        totalClients: response.data.totalClients,
        activeClients: response.data.activeClients,
        pendingClients: response.data.pendingClients,
      });
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || 'An error occurred while fetching client counts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientCounts();
  }, [fetchClientCounts]);

  return { clientCounts, loading, error };
};

export default useClientCounts;
