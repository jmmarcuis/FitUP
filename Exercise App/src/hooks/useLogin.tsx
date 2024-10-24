import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  // Add any other relevant client information
}


export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginComplete, setIsLoginComplete] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      setIsLoginComplete(true);
      toast.success('Login successful!');
      
      // Store token and client information
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('clientData', JSON.stringify(response.data.client));
      
      // Store individual client data fields
      const clientData: ClientData = response.data.client;
      localStorage.setItem('clientId', clientData.id);
      localStorage.setItem('clientFirstName', clientData.firstName);
      localStorage.setItem('clientLastName', clientData.lastName);
      localStorage.setItem('clientEmail', clientData.email);
      localStorage.setItem('clientProfilePicture', clientData.profilePicture);
      
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