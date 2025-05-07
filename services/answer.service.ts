import axios from '@/lib/axios';
import { Answer, AnswerFormData } from '@/types/answer';

// Get answers for a question
export const getAnswers = async (questionId: string) => {
  try {
    return await axios.get('/answers', { 
      params: { questionId } 
    });
  } catch (error) {
    console.error("Get answers error:", error);
    throw error;
  }
};

// Create a new answer
export const createAnswer = async (questionId: string, data: AnswerFormData) => {
  try {
    return await axios.post('/answers', {
      questionId,
      content: data.content
    });
  } catch (error) {
    console.error("Create answer error:", error);
    throw error;
  }
};

// Update an answer
export const updateAnswer = async (id: string, data: { content: string }) => {
  try {
    return await axios.put(`/answers/${id}`, data);
  } catch (error) {
    console.error("Update answer error:", error);
    throw error;
  }
};

// Delete an answer
export const deleteAnswer = async (id: string) => {
  try {
    return await axios.delete(`/answers/${id}`);
  } catch (error) {
    console.error("Delete answer error:", error);
    throw error;
  }
};

// Accept an answer
export const acceptAnswer = async (id: string) => {
  try {
    return await axios.patch(`/answers/${id}/accept`);
  } catch (error) {
    console.error("Accept answer error:", error);
    throw error;
  }
};