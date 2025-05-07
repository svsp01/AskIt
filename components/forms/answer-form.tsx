"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateAnswer } from '@/queries/useAnswers';
import { Loader2 } from 'lucide-react';

const answerSchema = z.object({
  content: z.string().min(30, { message: 'Answer must be at least 30 characters' }),
});

type AnswerFormValues = z.infer<typeof answerSchema>;

interface AnswerFormProps {
  questionId: string;
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const { toast } = useToast();
  const createAnswer = useCreateAnswer(questionId);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: '',
    },
  });
  
  const { control, reset, watch } = form;
  const content = watch('content');
  
  async function onSubmit(data: AnswerFormValues) {
    try {
      await createAnswer.mutateAsync(data);
      
      toast({
        title: 'Answer submitted!',
        description: 'Your answer has been posted successfully',
      });
      
      reset();
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        
        {isPreviewMode ? (
          <div className="min-h-[200px] p-3 border rounded-md bg-background">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : (
          <FormField
            control={control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Write your answer here... Be specific and include all the information someone would need to understand your answer."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createAnswer.isPending}
          >
            {createAnswer.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Post Your Answer'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}