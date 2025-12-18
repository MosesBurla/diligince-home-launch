import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/modules/comments/comments.service';
import { toast } from 'sonner';

export const useUpdateComment = (requirementId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) => 
      commentService.updateComment(commentId, { content }),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', requirementId] });
      toast.success('Comment updated');
    },
    
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update comment';
      toast.error(message);
    }
  });

  return {
    updateComment: mutation.mutate,
    updateCommentAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error
  };
};

export default useUpdateComment;
