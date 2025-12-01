import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Paperclip } from 'lucide-react';
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
  commentType?: 'general' | 'approval_rejection' | 'approval_request' | 'clarification';
  approvalStepId?: string;
  title?: string;
  placeholder?: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  requirementId,
  commentType = 'general',
  approvalStepId,
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

      // Use mock data only for now
      const mockComments: Comment[] = [
        {
          id: 'mock-1',
          requirementId,
          userId: 'user-1',
          userName: 'Sarah Johnson',
          userRole: 'Procurement Manager',
          content: 'This requirement looks good. Please ensure all compliance documents are attached before final approval.',
          commentType: 'general',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isEdited: false,
        },
        {
          id: 'mock-2',
          requirementId,
          userId: 'user-2',
          userName: 'Michael Chen',
          userRole: 'Budget Approver',
          content: 'Budget allocation approved. Timeline seems reasonable given the scope.',
          commentType: commentType,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          isEdited: false,
        },
        {
          id: 'mock-3',
          requirementId,
          userId: 'user-3',
          userName: 'Emily Davis',
          userRole: 'Technical Reviewer',
          content: 'Technical specifications need clarification on the data security requirements. Can we schedule a meeting?',
          commentType: 'clarification',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isEdited: false,
        },
      ];

      setComments(mockComments);
    } catch (error: any) {
      console.warn('Failed to set mock comments:', error?.message);
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
        relatedApprovalStepId: approvalStepId,
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
      case 'approval_rejection':
        return 'bg-red-100 text-red-800';
      case 'approval_request':
        return 'bg-blue-100 text-blue-800';
      case 'clarification':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCommentTypeColor(comment.commentType)}>
                        {comment.commentType.replace('_', ' ')}
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
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {comment.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          <Paperclip className="h-3 w-3" />
                          {attachment.fileName}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
