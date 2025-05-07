"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnswers, createAnswer, updateAnswer, deleteAnswer, acceptAnswer } from '@/services/answer.service';
import { AnswerFormData } from '@/types/answer';

// Hook for fetching answers for a question
export function useAnswers(questionId: string) {
  return useQuery({
    queryKey: ['answers', questionId],
    queryFn: () => getAnswers(questionId),
    select: (data) => data.data,
    enabled: !!questionId, // Only run the query if we have a questionId
  });
}

// Hook for creating a new answer
export function useCreateAnswer(questionId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AnswerFormData) => createAnswer(questionId, data),
    onSuccess: () => {
      // Invalidate the answers query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] });
    },
  });
}

// Hook for updating an answer
export function useUpdateAnswer(answerId: string, questionId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { content: string }) => updateAnswer(answerId, data),
    onSuccess: () => {
      // Invalidate the answers query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] });
    },
  });
}

// Hook for deleting an answer
export function useDeleteAnswer(questionId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (answerId: string) => deleteAnswer(answerId),
    onSuccess: () => {
      // Invalidate the answers query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] });
    },
  });
}

// Hook for accepting an answer
export function useAcceptAnswer(questionId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (answerId: string) => acceptAnswer(answerId),
    onSuccess: () => {
      // Invalidate the answers query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] });
    },
  });
}