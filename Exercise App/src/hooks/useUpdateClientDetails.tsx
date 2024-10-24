import { useState } from 'react';
import axios from 'axios';

interface UpdateClientDetails {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  profilePicture?: File;
}

const useUpdateClientDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateClientDetails = async (updates: UpdateClientDetails) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await axios.put('http://localhost:5000/client/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError('Failed to update client details');
      setLoading(false);
      throw err;
    }
  };

  return { updateClientDetails, loading, error };
};

export default useUpdateClientDetails;