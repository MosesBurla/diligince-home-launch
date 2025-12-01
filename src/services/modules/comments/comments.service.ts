import apiService from '../../core/api.service';
import { commentsRoutes } from './comments.routes';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentListResponse,
} from '@/types/comment';

class CommentService {
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const formData = new FormData();
    formData.append('requirementId', data.requirementId);
    formData.append('content', data.content);
    formData.append('commentType', data.commentType);
    
    if (data.relatedApprovalStepId) {
      formData.append('relatedApprovalStepId', data.relatedApprovalStepId);
    }
    
    if (data.parentCommentId) {
      formData.append('parentCommentId', data.parentCommentId);
    }
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    
    const response = await apiService.post<{ success: boolean; data: Comment }, FormData>(
      commentsRoutes.create,
      formData
    );
    
    return response.data;
  }

  async getCommentsByRequirement(
    requirementId: string,
    params?: { page?: number; limit?: number; commentType?: string }
  ): Promise<CommentListResponse> {
    const response = await apiService.get<CommentListResponse>(
      commentsRoutes.getByRequirement(requirementId, params)
    );
    return response;
  }

  async getApprovalComments(
    requirementId: string,
    approvalStepId: string
  ): Promise<Comment[]> {
    const response = await apiService.get<{ success: boolean; data: Comment[] }>(
      commentsRoutes.getApprovalComments(requirementId, approvalStepId)
    );
    return response.data;
  }

  async updateComment(
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<Comment> {
    const response = await apiService.put<{ success: boolean; data: Comment }, UpdateCommentRequest>(
      commentsRoutes.update(commentId),
      data
    );
    return response.data;
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiService.remove(commentsRoutes.delete(commentId));
  }
}

export const commentService = new CommentService();
export default commentService;
