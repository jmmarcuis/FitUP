import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Verify the token with your backend
        const response = await axios.get('http://localhost:5000/auth/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(true);
        setUser(response.data.client);
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading, user };
};