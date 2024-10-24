import { useState, useEffect } from 'react';
import axios from 'axios';

interface Coach {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  coachDescription: string;
  coachSpecialization: string;
}

const useGetCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const response = await axios.get('http://localhost:5000/coach/get-coach', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCoaches(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching coaches');
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  return { coaches, loading, error };
};

export default useGetCoaches;