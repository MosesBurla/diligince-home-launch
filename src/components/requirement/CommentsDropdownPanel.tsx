import React, { useState } from 'react';
import { MessageSquare, Send, Pencil, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownPanel } from '@/components/ui/dropdown-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useComments } from '@/hooks/useComments';
import { useAddComment } from '@/hooks/useAddComment';
import { useUpdateComment } from '@/hooks/useUpdateComment';
import { useDeleteComment } from '@/hooks/useDeleteComment';
import { useUser } from '@/contexts/UserContext';
import type { Comment } from '@/types/comment';

interface CommentsDropdownPanelProps {
  requirementId: string;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'approval':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'clarification':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
    case 'feedback':
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Check if comment is within 24-hour edit window
const isWithinEditWindow = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursDiff <= 24;
};

export const CommentsDropdownPanel: React.FC<CommentsDropdownPanelProps> = ({
  requirementId,
}) => {
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const { user } = useUser();
  const currentUserId = user?.id;
  
  const { comments, isLoading } = useComments({ 
    requirementId, 
    enabled: open 
  });
  const { addComment, isAdding } = useAddComment(requirementId);
  const { updateComment, isUpdating } = useUpdateComment(requirementId);
  const { deleteComment, isDeleting } = useDeleteComment(requirementId);

  const handleSendComment = () => {
    if (!newComment.trim() || isAdding) return;
    
    addComment(
      { content: newComment.trim(), commentType: 'general' },
      { onSuccess: () => setNewComment('') }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = () => {
    if (!editingCommentId || !editContent.trim() || isUpdating) return;
    
    updateComment(
      { commentId: editingCommentId, content: editContent.trim() },
      { onSuccess: () => handleCancelEdit() }
    );
  };

  const handleDelete = (commentId: string) => {
    if (isDeleting) return;
    deleteComment(commentId);
  };

  const canEditComment = (comment: Comment): boolean => {
    return comment.userId === currentUserId && isWithinEditWindow(comment.createdAt);
  };

  const canDeleteComment = (comment: Comment): boolean => {
    return comment.userId === currentUserId;
  };

  return (
    <DropdownPanel
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border/60 hover:bg-muted/50"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Comments</span>
          {comments.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {comments.length}
            </Badge>
          )}
        </Button>
      }
      title="Comments & Feedback"
      titleIcon={<MessageSquare className="h-4 w-4" />}
      headerExtra={
        comments.length > 0 && (
          <Badge variant="secondary" className="h-5 px-1.5 text-xs ml-2">
            {comments.length}
          </Badge>
        )
      }
      footer={
        <div className="p-3">
          <div className="relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment..."
              className={cn(
                "min-h-[60px] max-h-[120px] pr-12 resize-none",
                "bg-background/50 border-border/60",
                "focus:ring-1 focus:ring-primary/30"
              )}
            />
            <Button
              size="icon"
              className={cn(
                "absolute bottom-2 right-2 h-8 w-8 rounded-full",
                "bg-primary hover:bg-primary/90",
                "transition-transform hover:scale-105"
              )}
              disabled={!newComment.trim() || isAdding}
              onClick={handleSendComment}
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      }
    >
      {isLoading ? (
        <div className="py-4 px-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">No comments yet</p>
          <p className="text-xs mt-1">Be the first to add a comment</p>
        </div>
      ) : (
        <div className="py-2">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className={cn(
                "px-4 py-3 hover:bg-muted/40 transition-colors",
                index !== comments.length - 1 && "border-b border-border/30"
              )}
            >
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  {comment.userAvatar && (
                    <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {getInitials(comment.userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-foreground">
                      {comment.userName}
                    </span>
                    {comment.userRole && (
                      <span className="text-xs text-muted-foreground">
                        {comment.userRole}
                      </span>
                    )}
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] px-1.5 py-0 h-4 capitalize", getTypeColor(comment.commentType))}
                    >
                      {comment.commentType}
                    </Badge>
                    {comment.isEdited && (
                      <span className="text-[10px] text-muted-foreground italic">
                        (edited)
                      </span>
                    )}
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px] text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={!editContent.trim() || isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                        {(canEditComment(comment) || canDeleteComment(comment)) && (
                          <div className="flex items-center gap-1">
                            {canEditComment(comment) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={() => handleStartEdit(comment)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            )}
                            {canDeleteComment(comment) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(comment.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DropdownPanel>
  );
};

export default CommentsDropdownPanel;
