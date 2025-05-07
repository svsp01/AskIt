"use client";

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateQuestion } from '@/queries/useQuestions';
import { useAuth } from '@/queries/useAuth';
import { Loader2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const askSchema = z.object({
  title: z.string()
    .min(15, { message: 'Title must be at least 15 characters' })
    .max(150, { message: 'Title must be less than 150 characters' }),
  content: z.string()
    .min(30, { message: 'Question details must be at least 30 characters' }),
  tags: z.string()
    .transform(val => val.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean))
    .refine(tags => tags.length >= 1, { message: 'At least one tag is required' })
    .refine(tags => tags.length <= 5, { message: 'Maximum 5 tags allowed' })
    .refine(tags => tags.every(tag => tag.length >= 2), { message: 'Each tag must be at least 2 characters' })
    .refine(tags => tags.every(tag => tag.length <= 20), { message: 'Each tag must be less than 20 characters' }),
});

type AskFormValues = z.infer<typeof askSchema>;

export default function AskPage() {
  const { user, checkAuth } = useAuth();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const createQuestion = useCreateQuestion();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!checkAuth()) {
      router.push('/auth/login');
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to ask a question',
        variant: 'destructive',
      });
    }
  }, [checkAuth, router, toast]);
  
  const form = useForm<AskFormValues>({
    resolver: zodResolver(askSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  });
  
  const { control, reset, watch } = form;
  const content = watch('content');
  
  async function onSubmit(data: AskFormValues) {
    try {
      // Convert tags from string to array of strings
      const questionData = {
        title: data.title,
        content: data.content,
        tags: data.tags,
      };
      
      const response = await createQuestion.mutateAsync(questionData);
      
      toast({
        title: 'Question posted!',
        description: 'Your question has been submitted successfully',
      });
      
      // Redirect to the new question
      router.push(`/q/${response.data.id}`);
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    }
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
        <p className="text-muted-foreground">
          Get answers from our community of experts and AI assistant
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg border p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What's your programming question? Be specific." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific and imagine you're asking another person.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant={isPreviewMode ? "ghost" : "secondary"}
                      onClick={() => setIsPreviewMode(false)}
                      size="sm"
                    >
                      Write
                    </Button>
                    <Button
                      type="button"
                      variant={isPreviewMode ? "secondary" : "ghost"}
                      onClick={() => setIsPreviewMode(true)}
                      size="sm"
                      disabled={!content}
                    >
                      Preview
                    </Button>
                  </div>
                  
                  <FormField
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Details</FormLabel>
                        <FormControl>
                          {isPreviewMode ? (
                            <div className="min-h-[200px] p-3 border rounded-md bg-background">
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                {content.split('\n').map((paragraph, i) => (
                                  <p key={i}>{paragraph}</p>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Textarea
                              placeholder="Include all the information someone would need to answer your question."
                              className="min-h-[200px]"
                              {...field}
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          Explain what you've tried and what you're trying to achieve.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. javascript, react, node.js" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Add up to 5 tags to describe what your question is about. Separate tags with commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={createQuestion.isPending}
                  >
                    {createQuestion.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Your Question'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        <div>
          <div className="bg-muted rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Writing a good question
            </h3>
            
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <h4 className="font-medium">Be specific</h4>
                <p className="text-muted-foreground mt-1">
                  Avoid asking "How do I build X?". Ask about a specific problem you're facing.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Include code</h4>
                <p className="text-muted-foreground mt-1">
                  If your question is about code, include the relevant snippets and specify the language.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Describe what you've tried</h4>
                <p className="text-muted-foreground mt-1">
                  Show your research effort and explain what approaches you've already attempted.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Check for similar questions</h4>
                <p className="text-muted-foreground mt-1">
                  Before posting, search for similar questions to avoid duplicates.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link href="/search">
                  Search Existing Questions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}