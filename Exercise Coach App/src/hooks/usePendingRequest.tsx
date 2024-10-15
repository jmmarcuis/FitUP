import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  clientImage: string;
}

interface PendingRequest {
  _id: string;
  client: Client;
  status: string;
}

interface ErrorResponse {
  message: string;
}

const usePendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ pendingRequests: PendingRequest[] }>(
        'http://localhost:5000/collab/collaborations/pending',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setPendingRequests(response.data.pendingRequests);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const refetch = () => {
    fetchPendingRequests();
  };

  return { pendingRequests, loading, error, refetch };
};

export default usePendingRequests;