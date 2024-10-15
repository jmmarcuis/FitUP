import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginComplete, setIsLoginComplete] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const response = await axios.post('http://localhost:5000/coach/login', { email, password });
      setIsLoginComplete(true);
      toast.success('Login successful!');

      // Store token and redirect
      localStorage.setItem('token', response.data.token);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Login failed. Please try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return { handleLogin, isLoading, isLoginComplete, isButtonDisabled };
};
