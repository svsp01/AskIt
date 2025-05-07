import axios from '@/lib/axios';

export interface AIResponse {
  content: string;
  relatedQuestions?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  relatedAnswers?: Array<{
    id: string;
    content: string;
    questionId: string;
  }>;
}

export const generateAIResponse = async (query: string) => {
  try {
    const response = await axios.post<AIResponse>('/ai/generate', { query });
    return response.data;
  } catch (error) {
    console.error("Generate AI response error:", error);
    throw error;
  }
};