"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '@/services/question.service';
import { QuestionFormData } from '@/types/question';

// Hook for fetching questions with filtering and pagination
export function useQuestions(params?: { 
  limit?: number; 
  offset?: number; 
  tag?: string;
  search?: string;
  sort?: 'latest' | 'popular';
}) {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => getQuestions(params),
    select: (data) => data.data,
  });
}

// Hook for creating a new question
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: QuestionFormData) => createQuestion(data),
    onSuccess: () => {
      // Invalidate the questions query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

// Hook for updating a question
export function useUpdateQuestion(questionId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<QuestionFormData>) => updateQuestion(questionId, data),
    onSuccess: () => {
      // Invalidate the specific question and questions list
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

// Hook for deleting a question
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionId),
    onSuccess: () => {
      // Invalidate the questions query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}