export interface Comment {
  id: string;
  requirementId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  commentType: 'general' | 'approval_rejection' | 'approval_request' | 'clarification';
  relatedApprovalStepId?: string;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  attachments?: CommentAttachment[];
  mentions?: string[];
  parentCommentId?: string;
}

export interface CommentAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface CreateCommentRequest {
  requirementId: string;
  content: string;
  commentType: 'general' | 'approval_rejection' | 'approval_request' | 'clarification';
  relatedApprovalStepId?: string;
  parentCommentId?: string;
  attachments?: File[];
}

export interface UpdateCommentRequest {
  content: string;
  attachments?: File[];
}

export interface CommentListResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
