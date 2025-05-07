import axios from 'axios';

// Create an Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('askitai-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle auth errors
    if (response && response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('askitai-token');
        localStorage.removeItem('askitai-user');
        
        // Optional: redirect to login
        // window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;