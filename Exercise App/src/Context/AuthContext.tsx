// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import { ProfileData } from '../Types/ProfileData';
import * as authService from '../services/authService';

interface User {
  id: string;
  email: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userName: string) => Promise<void>;
  isProfileCompleted: boolean;
  completeProfile: (profileData: ProfileData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.fetchUser();
          setUser(userData);
          setIsAuthenticated(true);
          setIsProfileCompleted(userData.isProfileCompleted);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    const { token } = await authService.login(identifier, password);
    localStorage.setItem('token', token);
    const userData = await authService.fetchUser();
    setUser(userData);
    setIsAuthenticated(true);
    setIsProfileCompleted(userData.isProfileCompleted);
  };

  const register = async (email: string, password: string, userName: string) => {
    const { token } = await authService.register(email, password, userName);
    localStorage.setItem('token', token);
    const userData = await authService.fetchUser();
    setUser(userData);
    setIsAuthenticated(true);
    setIsProfileCompleted(false);
  };

  const completeProfile = async (profileData: ProfileData) => {
    await authService.completeProfile(profileData);
    const userData = await authService.fetchUser();
    setUser(userData);
    setIsProfileCompleted(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsProfileCompleted(false);
  };

  const updateUser = async (userData: Partial<User>) => {
    const updatedUser = await authService.updateUser(userData);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isProfileCompleted,
      isLoading,
      login,
      register,
      completeProfile,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );};