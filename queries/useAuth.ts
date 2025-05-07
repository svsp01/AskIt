"use client";

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/user';
import { LoginData, RegisterData, login, register } from '@/services/auth.service';
import { getStoredUser, clearAuth, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const loginUser = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(data);
      setUser(response.data.user);
      // Clear any cached queries when logging in
      queryClient.clear();
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const registerUser = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await register(data);
      setUser(response.data.user);
      // Clear any cached queries when registering
      queryClient.clear();
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    // Clear all cached queries when logging out
    queryClient.clear();
    router.push('/');
  };

  const checkAuth = () => {
    return isAuthenticated();
  };

  return {
    user,
    loading,
    error,
    loginUser,
    registerUser,
    logout,
    checkAuth,
    isAuthenticated: !!user
  };
}