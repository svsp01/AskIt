"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/queries/useAuth';
import { Brain, User, Send, Sparkles, Bot, Loader2, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/types/question';
import questions from '@/data/questions.json';
import answers from '@/data/answers.json';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: 'loading' | 'complete' | 'error';
}

interface SuggestedQuestion {
  id: string;
  title: string;
}

export default function AIChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(60); // Initial height
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Initial greeting message from AI
  useEffect(() => {
    if (messages.length === 0) {
      const initialSuggestions = getRandomQuestions(3);
      setSuggestedQuestions(initialSuggestions);
      
      setMessages([
        {
          id: "initial-message",
          content: `Hello${user ? ` ${user.name || user.username}` : ''}! I'm the AskIt AI assistant. I can help answer your technical questions based on the community's knowledge. What would you like to know about today?`,
          sender: 'ai',
          timestamp: new Date(),
          status: 'complete'
        }
      ]);
    }
  }, [user, messages.length]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Auto-resize textarea based on content
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Reset height to ensure proper calculation
    e.target.style.height = 'auto';
    // Set new height based on scrollHeight (with a max height)
    const newHeight = Math.min(e.target.scrollHeight, 200);
    setInputHeight(newHeight);
    e.target.style.height = `${newHeight}px`;
  };
  
  // Submit message
  const handleSubmit = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add AI message with loading state
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      status: 'loading'
    };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInput('');
    setInputHeight(60); // Reset height
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Find a matching question or generate a response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input.trim());
      const newSuggestions = getRandomQuestions(3);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, content: aiResponse, status: 'complete' } 
            : msg
        )
      );
      
      setSuggestedQuestions(newSuggestions);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  // Generate AI response based on input
  const generateAIResponse = (query: string): string => {
    // Search questions and answers for relevant content
    const lowerQuery = query.toLowerCase();
    
    // Try to find exact matches in questions
    const exactMatches = questions.filter(q => 
      q.title.toLowerCase().includes(lowerQuery) || 
      q.content.toLowerCase().includes(lowerQuery)
    );
    
    if (exactMatches.length > 0) {
      // Find the best match
      const bestMatch = exactMatches[0];
      
      // Get answers for this question
      const questionAnswers = answers.filter(a => a.questionId === bestMatch.id);
      
      if (questionAnswers.length > 0) {
        // Find the accepted or highest voted answer
        const bestAnswer = questionAnswers.find(a => a.isAccepted) || 
          questionAnswers.sort((a, b) => b.voteCount - a.voteCount)[0];
        
        return `Based on a similar question in our community, here's what I found:

${bestAnswer.content}

This answer is from our community. You can view the full question and more answers here: [${bestMatch.title}](/q/${bestMatch.id})`;
      }
      
      return `I found a relevant question in our community: "${bestMatch.title}"

${bestMatch.content.substring(0, 200)}${bestMatch.content.length > 200 ? '...' : ''}

You can view this question and its answers here: [${bestMatch.title}](/q/${bestMatch.id})`;
    }
    
    // If no exact matches, return a generic response
    return `I don't have a specific answer for that question in my knowledge base yet. 

Here are some options that might help:

1. You could post this as a new question to get answers from our community
2. Try rephrasing your question with more specific details
3. Browse similar topics in our question database

Would you like me to help you create a new question for the community?`;
  };
  
  // Get random questions for suggestions
  const getRandomQuestions = (count: number): SuggestedQuestion[] => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(q => ({
      id: q.id,
      title: q.title
    }));
  };
  
  // Handle suggested question click
  const handleSuggestedQuestion = (question: SuggestedQuestion) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: question.title,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add AI message with loading state
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      status: 'loading'
    };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Find the question and generate a response
    setTimeout(() => {
      const foundQuestion = questions.find(q => q.id === question.id);
      let aiResponse = `I couldn't find that question in our database.`;
      
      if (foundQuestion) {
        // Get answers for this question
        const questionAnswers = answers.filter(a => a.questionId === foundQuestion.id);
        
        if (questionAnswers.length > 0) {
          // Find the accepted or highest voted answer
          const bestAnswer = questionAnswers.find(a => a.isAccepted) || 
            questionAnswers.sort((a, b) => b.voteCount - a.voteCount)[0];
          
          aiResponse = `Here's information about that question:

"${foundQuestion.title}"

${bestAnswer.content}

You can view the full question and more answers here: [${foundQuestion.title}](/q/${foundQuestion.id})`;
        } else {
          aiResponse = `Here's information about that question:

"${foundQuestion.title}"

${foundQuestion.content}

This question doesn't have any answers yet. You can view the question here: [${foundQuestion.title}](/q/${foundQuestion.id})`;
        }
      }
      
      const newSuggestions = getRandomQuestions(3);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, content: aiResponse, status: 'complete' } 
            : msg
        )
      );
      
      setSuggestedQuestions(newSuggestions);
      setIsTyping(false);
    }, 1000);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main chat area */}
        <div className="md:col-span-3">
          <div className="bg-card rounded-lg border h-[calc(100vh-12rem)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Brain className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">AskIt AI Assistant</h2>
                <p className="text-xs text-muted-foreground">Powered by community knowledge</p>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={user?.avatarUrl} alt={user?.name || user?.username || 'User'} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 mt-1 bg-primary/10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Brain className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.status === 'loading' ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert">
                          {message.content.split('\n').map((paragraph, i) => {
                            // Check if this paragraph contains a link
                            if (paragraph.includes('[') && paragraph.includes('](/q/')) {
                              const linkStart = paragraph.indexOf('[');
                              const linkTextEnd = paragraph.indexOf(']', linkStart);
                              const linkHrefStart = paragraph.indexOf('(/q/', linkTextEnd);
                              const linkHrefEnd = paragraph.indexOf(')', linkHrefStart);
                              
                              if (linkStart >= 0 && linkTextEnd >= 0 && linkHrefStart >= 0 && linkHrefEnd >= 0) {
                                const beforeLink = paragraph.substring(0, linkStart);
                                const linkText = paragraph.substring(linkStart + 1, linkTextEnd);
                                const linkHref = paragraph.substring(linkHrefStart + 1, linkHrefEnd);
                                const afterLink = paragraph.substring(linkHrefEnd + 1);
                                
                                return (
                                  <p key={i}>
                                    {beforeLink}
                                    <Link href={linkHref} className="text-blue-500 hover:underline">
                                      {linkText}
                                    </Link>
                                    {afterLink}
                                  </p>
                                );
                              }
                            }
                            
                            return <p key={i}>{paragraph}</p>;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 border-t">
              <div className="relative">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="pr-12 resize-none"
                  style={{ height: `${inputHeight}px` }}
                  disabled={isTyping}
                />
                <Button
                  size="icon"
                  className="absolute right-2 bottom-2"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="hidden md:block">
          <div className="bg-card rounded-lg border p-4 sticky top-24">
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                About AskIt AI
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                I'm trained on the community knowledge base to help answer your technical questions. 
                I can point you to relevant questions and answers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Suggested Questions
              </h3>
              
              <div className="space-y-2">
                {suggestedQuestions.map((question) => (
                  <Button
                    key={question.id}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 px-3 font-normal"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question.title}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Link href="/ask">
                <Button className="w-full">
                  Ask the Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}