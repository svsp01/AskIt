import jwt from 'jsonwebtoken';
import User from '@/models/User';

export async function auth(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string };
    
    const user = await User.findById(decoded.userId)
      .select('-password');
    
    return user;
  } catch (error) {
    return null;
  }
}

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem('askitai-user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('askitai-token');
  localStorage.removeItem('askitai-user');
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('askitai-token');
  const user = localStorage.getItem('askitai-user');
  return !!token && !!user;
};