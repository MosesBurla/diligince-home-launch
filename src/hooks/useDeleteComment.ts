import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/modules/comments/comments.service';
import { toast } from 'sonner';

export const useDeleteComment = (requirementId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', requirementId] });
      toast.success('Comment deleted');
    },
    
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete comment';
      toast.error(message);
    }
  });

  return {
    deleteComment: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error
  };
};

export default useDeleteComment;
