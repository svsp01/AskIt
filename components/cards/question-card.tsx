import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Eye, ThumbsUp, User } from 'lucide-react';
import { Question } from '@/types/question';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface QuestionCardProps {
  question: Question;
  variant?: 'default' | 'compact';
}

export function QuestionCard({ question, variant = 'default' }: QuestionCardProps) {
  const {
    _id,
    title,
    content,
    tags,
    createdAt,
    viewCount,
    voteCount,
    author,
  } = question;

  // Format content preview by truncating
  const contentPreview = 
    variant === 'compact' 
      ? ''
      : content.length > 160 
        ? `${content.substring(0, 160)}...` 
        : content;

  // Format date as relative time
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  // Get author initials for avatar fallback
  const authorInitials = author?.name
    ? author.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : author?.username.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="bg-card rounded-lg border p-5 transition-all hover:shadow-md">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <Link href={`/q/${_id}`} className="group">
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
        </div>
        
        {variant !== 'compact' && (
          <p className="mt-2 text-muted-foreground">{contentPreview}</p>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link href={`/search?tag=${tag}`} key={tag}>
              <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-muted-foreground">
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{voteCount}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MessageSquare className="mr-1 h-4 w-4" />
              {/* In a real app, we would get answers count from API */}
              <span>{Math.floor(Math.random() * 10)}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Eye className="mr-1 h-4 w-4" />
              <span>{viewCount}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <Link href={`/profile/${author?.username || ''}`} className="flex items-center hover:underline">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={author?.avatarUrl} alt={author?.name || author?.username || ''} />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{author?.name || author?.username}</span>
              </Link>
            </div>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}