"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnswerCard } from '@/components/cards/answer-card';
import { AnswerForm } from '@/components/forms/answer-form';
import { useQuestionById } from '@/queries/useQuestionById';
import { useAnswers } from '@/queries/useAnswers';
import { useAuth } from '@/queries/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import { Answer } from '@/types/answer';

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: question, isLoading: isLoadingQuestion } = useQuestionById(id as string);
  const { data: answers, isLoading: isLoadingAnswers } = useAnswers(id as string);
  
  useEffect(() => {
    // This would be a good place to increment view count in a real app
  }, []);
  
  if (isLoadingQuestion) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </div>
    );
  }
  
  if (!question) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex flex-col items-center gap-4">
          <MessageSquare className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Question not found</h1>
          <p className="text-muted-foreground">The question you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Format date as relative time
  const formattedDate = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true });
  
  // Get author initials for avatar fallback
  const authorInitials = question.author?.name
    ? question.author.name.split(' ').map((n:any) => n[0]).join('').toUpperCase().substring(0, 2)
    : question.author?.username.substring(0, 2).toUpperCase() || 'U';
  
  return (
    <div className="container mx-auto py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Link>
        </Button>
      </div>
      
      {/* Question */}
      <div className="bg-card rounded-lg border p-6 mb-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">{question.title}</h1>
          
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag:any) => (
              <Link href={`/search?tag=${tag}`} key={tag}>
                <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
            <div className="flex items-center text-muted-foreground">
              <ThumbsUp className="mr-2 h-5 w-5" />
              <span>{question.voteCount} votes</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Eye className="mr-2 h-5 w-5" />
              <span>{question.viewCount} views</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MessageSquare className="mr-2 h-5 w-5" />
              <span>{answers?.length || 0} answers</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="prose prose-sm dark:prose-invert max-w-none my-4">
            {question.content.split('\n').map((paragraph:any, i:any) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${question.author?.username || ''}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={question.author?.avatarUrl} alt={question.author?.name || question.author?.username || ''} />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link href={`/profile/${question.author?.username || ''}`} className="text-sm font-medium hover:underline">
                  {question.author?.name || question.author?.username}
                </Link>
                <p className="text-xs text-muted-foreground">Asked {formattedDate}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-1 h-4 w-4" />
                Helpful
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{answers?.length || 0} Answers</h2>
        
        {isLoadingAnswers ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : answers && answers.length > 0 ? (
          <div className="space-y-4">
            {answers.map((answer:Answer) => (
              <AnswerCard 
                key={answer._id} 
                answer={answer} 
                questionAuthorId={question.authorId}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted p-8 rounded-lg text-center">
            <p className="text-muted-foreground">
              No answers yet. Be the first to share your knowledge!
            </p>
          </div>
        )}
      </div>
      
      {/* Answer Form */}
      {user ? (
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-bold mb-4">Your Answer</h2>
          <AnswerForm questionId={id as string} />
        </div>
      ) : (
        <div className="bg-muted p-8 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">
            You need to sign in to answer this question.
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}