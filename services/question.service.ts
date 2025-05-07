import axios from '@/lib/axios';
import { Question, QuestionFormData } from '@/types/question';

// Get all questions with filtering and sorting
export const getQuestions = async (params?: { 
  limit?: number; 
  offset?: number; 
  tag?: string;
  search?: string;
  sort?: 'latest' | 'popular';
}) => {
  try {
    return await axios.get('/questions', { params });
  } catch (error) {
    console.error("Get questions error:", error);
    throw error;
  }
};

// Get a single question by ID
export const getQuestionById = async (id: string) => {
  try {
    return await axios.get(`/questions/${id}`);
  } catch (error) {
    console.error("Get question error:", error);
    throw error;
  }
};

// Create a new question
export const createQuestion = async (data: QuestionFormData) => {
  try {
    return await axios.post('/questions', data);
  } catch (error) {
    console.error("Create question error:", error);
    throw error;
  }
};

// Update a question
export const updateQuestion = async (id: string, data: Partial<QuestionFormData>) => {
  try {
    return await axios.put(`/questions/${id}`, data);
  } catch (error) {
    console.error("Update question error:", error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (id: string) => {
  try {
    return await axios.delete(`/questions/${id}`);
  } catch (error) {
    console.error("Delete question error:", error);
    throw error;
  }
};