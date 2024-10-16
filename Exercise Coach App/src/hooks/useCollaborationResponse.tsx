import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface UseCollaborationResponseResult {
  respondToCollaboration: (id: string, response: 'accept' | 'decline') => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message: string;
}

const useCollaborationResponse = (): UseCollaborationResponseResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const respondToCollaboration = async (id: string, response: 'accept' | 'decline') => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/collab/collaborations/${id}/respond`,
        { response },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // You might want to update the local state or trigger a re-fetch of pending requests here
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'An error occurred while responding to the collaboration');
    } finally {
      setIsLoading(false);
    }
  };

  return { respondToCollaboration, isLoading, error };
};

export default useCollaborationResponse;