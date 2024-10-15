import { useState } from 'react';
import axios from 'axios';

interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async ({ currentPassword, newPassword }: ChangePasswordParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/client/change-password',
        { currentPassword, newPassword },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to change password');
      } else {
        setError('An unexpected error occurred');
      }
      setLoading(false);
      throw err;
    }
  };

  return { changePassword, loading, error };
};

export default useChangePassword;