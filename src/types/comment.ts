export interface Comment {
  id: string;
  requirementId: string;
  companyId?: string;
  
  // User details
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  userDepartment?: string;
  userAvatar?: string;
  
  // Content
  content: string;
  commentType: 'general' | 'approval' | 'clarification' | 'feedback';
  
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
}

export interface CreateCommentRequest {
  requirementId: string;
  content: string;
  commentType: 'general' | 'approval' | 'clarification' | 'feedback';
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentListResponse {
  success: boolean;
  statusCode?: number;
  data: {
    comments: Comment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
  };
}

export interface CreateCommentResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: Comment;
  meta?: {
    notificationsSent: number;
    notificationRecipients: string[];
  };
}

export interface UpdateCommentResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: Comment;
}

export interface DeleteCommentResponse {
  success: boolean;
  statusCode?: number;
  message: string;
}
