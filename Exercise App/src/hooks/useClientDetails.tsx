import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get<ClientDetails>('http://localhost:5000/client/details', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setClientDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch client details');
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, []);

  return { clientDetails, loading, error };
};

export default useClientDetails;