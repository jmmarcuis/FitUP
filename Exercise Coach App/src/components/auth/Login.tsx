import React, { useState } from 'react';
import { login } from '../../services/authService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      // Handle successful login (e.g., save token, redirect)
      console.log('Logged in:', data);
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};

export default Login;