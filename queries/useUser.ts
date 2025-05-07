import { useQuery } from '@tanstack/react-query';
import { getUserByUsername, getUserQuestions, getUserAnswers } from '@/services/user.service';

export function useUser(username: string) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => getUserByUsername(username),
    enabled: !!username,
  });
}

export function useUserQuestions(userId: string) {
  return useQuery({
    queryKey: ['userQuestions', userId],
    queryFn: () => getUserQuestions(userId),
    enabled: !!userId,
  });
}

export function useUserAnswers(userId: string) {
  return useQuery({
    queryKey: ['userAnswers', userId],
    queryFn: () => getUserAnswers(userId),
    enabled: !!userId,
  });
}