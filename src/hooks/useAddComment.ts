import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/modules/comments/comments.service';
import { toast } from 'sonner';
import type { CreateCommentRequest } from '@/types/comment';

export const useAddComment = (requirementId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<CreateCommentRequest, 'requirementId'>) => 
      commentService.createComment({ ...data, requirementId }),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', requirementId] });
      toast.success('Comment added successfully');
    },
    
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add comment';
      toast.error(message);
    }
  });

  return {
    addComment: mutation.mutate,
    addCommentAsync: mutation.mutateAsync,
    isAdding: mutation.isPending,
    error: mutation.error
  };
};

export default useAddComment;
