import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  X, 
  Send, 
  User,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useComments } from '@/hooks/useComments';
import { useAddComment } from '@/hooks/useAddComment';
import { toast } from 'sonner';

interface InlineCommentsPanelProps {
  requirementId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const InlineCommentsPanel: React.FC<InlineCommentsPanelProps> = ({
  requirementId,
  isOpen,
  onClose
}) => {
  const [newComment, setNewComment] = useState('');
  
  const { 
    comments, 
    isLoading, 
    refetchComments 
  } = useComments({ 
    requirementId, 
    enabled: isOpen 
  });
  
  const { addComment, isAdding } = useAddComment(requirementId);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    addComment({
      content: newComment.trim(),
      commentType: 'feedback'
    }, {
      onSuccess: () => {
        setNewComment('');
        refetchComments();
      },
      onError: () => {
        toast.error('Failed to add comment');
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy, HH:mm');
    } catch {
      return dateStr;
    }
  };

  if (!isOpen) return null;

  return (
    <Card className={cn(
      "border-primary/20 shadow-lg",
      "animate-in slide-in-from-top-2 fade-in-0 duration-300"
    )}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Comments & Feedback
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        <ScrollArea className="h-[200px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div 
                  key={comment.id}
                  className="p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">
                          {comment.userName || 'Unknown User'}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Add Comment */}
        <div className="flex gap-2 pt-2 border-t">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none"
            disabled={isAdding}
          />
          <Button 
            size="icon"
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isAdding}
            className="flex-shrink-0"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InlineCommentsPanel;
