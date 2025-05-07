import axios from '@/lib/axios';
import { User } from '@/types/user';
import { Question } from '@/types/question';
import { Answer } from '@/types/answer';

export const getUserByUsername = async (userID: string) => {
  try {
    const response = await axios.get(`/users/${userID}`);
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

export const getUserQuestions = async (userId: string) => {
  try {
    const response = await axios.get(`/users/${userId}/questions`);
    return response.data;
  } catch (error) {
    console.error("Get user questions error:", error);
    throw error;
  }
};

export const getUserAnswers = async (userId: string) => {
  try {
    const response = await axios.get(`/users/${userId}/answers`);
    return response.data;
  } catch (error) {
    console.error("Get user answers error:", error);
    throw error;
  }
};