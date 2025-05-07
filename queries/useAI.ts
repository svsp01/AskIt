"use client";

import { useMutation } from '@tanstack/react-query';
import { generateAIResponse } from '@/services/ai.service';

export function useGenerateAIResponse() {
  return useMutation({
    mutationFn: (query: string) => generateAIResponse(query),
  });
}