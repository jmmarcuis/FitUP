import api from './api'; 
import { ProfileData } from '../Types/ProfileData';

  const API_BASE_URL =  "http://localhost:5000";

export const login = async (identifier: string, password: string) => {
  const response = await api.post(`${API_BASE_URL}/auth/login`, { identifier, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (email: string, password: string, userName: string) => {
  const response = await api.post(`${API_BASE_URL}/auth/register`, { email, password, userName });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const completeProfile = async (profileData: ProfileData) => {
  const response = await api.post(`${API_BASE_URL}/auth/complete-profile`, profileData);
  return response.data;
};

export const fetchUser = async () => {
  const response = await api.get(`${API_BASE_URL}/auth/profile`);
  return response.data;
};

export const updateUser = async (userData: Partial<ProfileData>) => {
  const response = await api.put(`${API_BASE_URL}/auth/profile`, userData);
  return response.data;
};
export const logout = () => {
  localStorage.removeItem('token');
};