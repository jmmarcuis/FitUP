import { useState } from 'react';
import axios from 'axios';

interface CollaborationRequest {
  clientId: string;
  coachId: string;
}

interface CollaborationResponse {
  message: string;
  collaboration: {
    _id: string;
    client: string;
    coach: string;
    status: string;
  };
}

const useCollaboration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCollaboration = async (request: CollaborationRequest) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<CollaborationResponse>(
        'http://localhost:5000/collab/collaborations',
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred while requesting collaboration');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  return { requestCollaboration, loading, error };
};

export default useCollaboration;