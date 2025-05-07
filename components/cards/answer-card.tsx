"use client";

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Check, Flag, Trash, Edit, Loader2 } from 'lucide-react';
import { Answer } from '@/types/answer';
import { useAuth } from '@/queries/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDeleteAnswer, useUpdateAnswer, useAcceptAnswer } from '@/queries/useAnswers';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

interface AnswerCardProps {
  answer: Answer;
  questionAuthorId: string;
}

export function AnswerCard({ answer, questionAuthorId }: AnswerCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);
  
  const deleteAnswer = useDeleteAnswer(answer.question._id);
  const updateAnswer = useUpdateAnswer(answer._id, answer.question._id);
  const acceptAnswer = useAcceptAnswer(answer.question._id);
  
  const isAuthor = user?._id === answer.author;
  const isQuestionAuthor = user?._id === questionAuthorId;
  const canAccept = isQuestionAuthor && !answer.isAccepted;
  
  // Format date as relative time
  const formattedDate = formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true });
  
  // Get author initials for avatar fallback
  const authorInitials = answer.author?.name
    ? answer.author.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : answer.author?.username.substring(0, 2).toUpperCase() || 'U';
    
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this answer?')) {
      try {
        await deleteAnswer.mutateAsync(answer._id);
        toast({
          title: 'Answer deleted',
          description: 'Your answer has been removed',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete answer',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleEdit = async () => {
    if (isEditing) {
      try {
        await updateAnswer.mutateAsync({ content: editContent });
        setIsEditing(false);
        toast({
          title: 'Answer updated',
          description: 'Your answer has been modified',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update answer',
          variant: 'destructive',
        });
      }
    } else {
      setIsEditing(true);
    }
  };
  
  const handleAccept = async () => {
    try {
      await acceptAnswer.mutateAsync(answer._id);
      toast({
        title: 'Answer accepted',
        description: 'You have marked this as the accepted answer',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept answer',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className={`bg-card rounded-lg border p-5 ${answer.isAccepted ? 'border-green-500 dark:border-green-700' : ''}`}>
      <div className="flex">
        {/* Voting & Accept Section */}
        <div className="flex flex-col items-center mr-4 space-y-2">
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <ThumbsUp className="h-5 w-5" />
            <span className="sr-only">Upvote</span>
          </Button>
          
          <span className="font-medium">{answer.voteCount}</span>
          
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <ThumbsDown className="h-5 w-5" />
            <span className="sr-only">Downvote</span>
          </Button>
          
          {answer.isAccepted && (
            <div className="mt-2 text-green-600 dark:text-green-500">
              <Check className="h-6 w-6" />
              <span className="sr-only">Accepted answer</span>
            </div>
          )}
        </div>
        
        {/* Answer Content */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[150px]"
              />
              
              <div className="flex space-x-2">
                <Button onClick={handleEdit} disabled={updateAnswer.isPending}>
                  {updateAnswer.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setEditContent(answer.content);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {answer.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              
              <div className="mt-4 flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                  <Link href={`/profile/${answer.author?.username || ''}`} className="flex items-center hover:underline mr-3">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={answer.author?.avatarUrl} alt={answer.author?.name || answer.author?.username || ''} />
                      <AvatarFallback>{authorInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{answer.author?.name || answer.author?.username}</span>
                  </Link>
                  <span className="text-xs text-muted-foreground">{formattedDate}</span>
                </div>
                
                <div className="flex space-x-1 mt-2 sm:mt-0">
                  {isAuthor && (
                    <>
                      <Button variant="ghost" size="sm" onClick={handleEdit} className="text-xs h-8 px-2">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleDelete}
                        disabled={deleteAnswer.isPending}
                        className="text-xs h-8 px-2 text-destructive hover:text-destructive"
                      >
                        {deleteAnswer.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Trash className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    </>
                  )}
                  
                  {!isAuthor && (
                    <Button variant="ghost" size="sm" className="text-xs h-8 px-2">
                      <Flag className="h-3.5 w-3.5 mr-1" />
                      Report
                    </Button>
                  )}
                  
                  {canAccept && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAccept} 
                      disabled={acceptAnswer.isPending}
                      className="text-xs h-8 px-2 text-green-600 hover:text-green-700 border-green-600 hover:border-green-700"
                    >
                      {acceptAnswer.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Accept
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}