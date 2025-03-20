import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { register } from '../api/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await register(username, email, password);
      login(data.token);
      showToast('success', 'Registration Successful', 'You have been registered and logged in.');
      navigate('/dashboard');
    } catch (error) {
      showToast('error', 'Registration Failed', error instanceof Error ? error.message : 'An error occurred during registration');
    }
  };

  // ... rest of the component
}