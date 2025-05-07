import axios from '@/lib/axios';
// import { User } from '@/types/user';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Login
export const login = async (data: LoginData) => {
  try {
    const response = await axios.post('/auth/login', data);
    const { user, token } = response.data;
    // Store auth data in localStorage
    localStorage.setItem('askitai-token', token);
    localStorage.setItem('askitai-user', JSON.stringify(user));
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register
export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post('/auth/register', data);
    const { user, token } = response.data;
    // Store auth data in localStorage
    localStorage.setItem('askitai-token', token);
    localStorage.setItem('askitai-user', JSON.stringify(user));
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    return await axios.post('/auth/reset-password', { email });
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};