import apiService from '../../core/api.service';
import { commentsRoutes } from './comments.routes';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentListResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
} from '@/types/comment';

class CommentService {
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await apiService.post<CreateCommentResponse, CreateCommentRequest>(
      commentsRoutes.create,
      data
    );
    return response.data;
  }

  async getCommentsByRequirement(
    requirementId: string,
    params?: { page?: number; limit?: number; sortOrder?: 'asc' | 'desc' }
  ): Promise<CommentListResponse> {
    const response = await apiService.get<CommentListResponse>(
      commentsRoutes.getByRequirement(requirementId, params)
    );
    return response;
  }

  async updateComment(
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<Comment> {
    const response = await apiService.put<UpdateCommentResponse, UpdateCommentRequest>(
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
