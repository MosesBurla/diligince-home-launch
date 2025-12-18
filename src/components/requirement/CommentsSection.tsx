import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import commentService from '@/services/modules/comments/comments.service';
import { Comment, CreateCommentRequest } from '@/types/comment';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface CommentsSectionProps {
  requirementId: string;
  commentType?: 'general' | 'approval' | 'clarification' | 'feedback';
  title?: string;
  placeholder?: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  requirementId,
  commentType = 'general',
  title = 'Comments',
  placeholder = 'Add a comment...',
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [requirementId, commentType]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getCommentsByRequirement(requirementId);
      setComments(response.data.comments);
    } catch (error: any) {
      console.error('Failed to fetch comments:', error?.message);
      toast.error('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const commentData: CreateCommentRequest = {
        requirementId,
        content: newComment,
        commentType,
      };

      const createdComment = await commentService.createComment(commentData);

      setComments([createdComment, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case 'approval':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'clarification':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'feedback':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Defensive guard for comments array
  const commentList = Array.isArray(comments) ? comments : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title}
          <Badge variant="outline" className="ml-auto">
            {commentList.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder={placeholder}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="flex-1"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-muted-foreground py-4">Loading comments...</p>
          ) : commentList.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No comments yet</p>
          ) : (
            commentList.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 bg-muted/50 rounded-lg border"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{comment.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {comment.userRole} • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        {comment.isEdited && <span className="italic ml-1">(edited)</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCommentTypeColor(comment.commentType)}>
                        {comment.commentType}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
