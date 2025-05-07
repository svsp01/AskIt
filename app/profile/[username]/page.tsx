'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionCard } from '@/components/cards/question-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageSquare,
  Calendar,
  Link2,
  Edit,
  User as UserIcon,
  ThumbsUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { User } from '@/types/user';
import { Question } from '@/types/question';
import { Answer } from '@/types/answer';
import {
  useUser,
  useUserQuestions,
  useUserAnswers,
} from '@/queries/useUser';
import { useAuth } from '@/queries/useAuth';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();

  const { data: user, isLoading: isUserLoading } = useUser(username);
  const {
    data: userQuestions = [],
    isLoading: isQuestionsLoading,
  } = useUserQuestions(user?._id);
  const {
    data: userAnswers = [],
    isLoading: isAnswersLoading,
  } = useUserAnswers(user?._id);

  const isLoading = isUserLoading || isQuestionsLoading || isAnswersLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-card rounded-lg border p-6 flex flex-col items-center text-center">
              <Skeleton className="h-24 w-24 rounded-full mb-4" />
              <Skeleton className="h-7 w-40 mb-2" />
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-4" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
          <div className="md:w-3/4">
            <div className="bg-card rounded-lg border p-6">
              <Skeleton className="h-10 w-48 mb-6" />
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-muted/50 rounded-lg p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex flex-col items-center gap-4">
          <UserIcon className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    );
  }

  const joinedDate = format(new Date(user.createdAt), 'MMMM yyyy');
  const userInitials = user.name
    ? user.name
        .split(' ')
        .map((n: any) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : user.username.substring(0, 2).toUpperCase();

  const isCurrentUser = currentUser?._id === user._id;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="bg-card rounded-lg border p-6 sticky top-24">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.name || user.username}
                />
                <AvatarFallback className="text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-2xl font-bold">
                {user.name || user.username}
              </h1>
              <p className="text-muted-foreground mb-4">@{user.username}</p>

              {user.bio && <p className="text-sm mb-6">{user.bio}</p>}

              <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {joinedDate}</span>
              </div>

              <div className="grid grid-cols-2 w-full gap-4 text-center">
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-2xl font-bold">{userQuestions.length}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-2xl font-bold">{userAnswers.length}</p>
                  <p className="text-xs text-muted-foreground">Answers</p>
                </div>
              </div>

              <div className="mt-6 w-full">
                {isCurrentUser ? (
                  <Button className="w-full" asChild>
                    <a href="/settings">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="bg-card rounded-lg border p-6">
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questions">
                  Questions ({userQuestions.length})
                </TabsTrigger>
                <TabsTrigger value="answers">
                  Answers ({userAnswers.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="mt-6">
                {userQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {userQuestions.map((question: Question) => (
                      <QuestionCard
                        key={question._id}
                        question={{
                          ...question,
                          author: {
                            _id: user._id,
                            username: user.username,
                            name: user.name,
                            avatarUrl: user.avatarUrl,
                          },
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted p-8 rounded-lg text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {isCurrentUser
                        ? "You haven't asked any questions yet."
                        : `${user.name || user.username} hasn't asked any questions yet.`}
                    </p>
                    {isCurrentUser && (
                      <Button asChild>
                        <a href="/ask">Ask a Question</a>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="answers" className="mt-6">
                {userAnswers.length > 0 ? (
                  <div className="space-y-6">
                    {userAnswers.map((answer: Answer) => (
                      <div key={answer._id} className="bg-muted/50 rounded-lg p-4">
                        <a
                          href={`/q/${answer.question._id}`}
                          className="block mb-2"
                        >
                          <h3 className="text-lg font-medium hover:text-primary transition-colors">
                            {answer.question.title}
                          </h3>
                        </a>

                        <div className="prose prose-sm dark:prose-invert max-w-none mt-2 line-clamp-3">
                          {answer.content.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mt-4 text-sm">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{answer.voteCount}</span>
                            {answer.isAccepted && (
                              <span className="ml-3 text-green-600 dark:text-green-500 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accepted
                              </span>
                            )}
                          </div>
                          <a
                            href={`/q/${answer.question._id}`}
                            className="text-primary hover:underline flex items-center"
                          >
                            <Link2 className="h-4 w-4 mr-1" />
                            View Question
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted p-8 rounded-lg text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No answers yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {isCurrentUser
                        ? "You haven't answered any questions yet."
                        : `${user.name || user.username} hasn't answered any questions yet.`}
                    </p>
                    {isCurrentUser && (
                      <Button asChild>
                        <a href="/search">Browse Questions</a>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
