"use client";

import { useQuery } from '@tanstack/react-query';
import { getQuestionById } from '@/services/question.service';

export function useQuestionById(id: string) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => getQuestionById(id),
    select: (data) => data.data,
    enabled: !!id, // Only run the query if we have an ID
  });
}