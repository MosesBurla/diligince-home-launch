import { useQuery, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/modules/comments/comments.service';

interface UseCommentsParams {
  requirementId: string;
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

export const useComments = ({
  requirementId,
  page = 1,
  limit = 50,
  sortOrder = 'desc',
  enabled = true
}: UseCommentsParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['comments', requirementId, { page, limit, sortOrder }],
    queryFn: () => commentService.getCommentsByRequirement(requirementId, { page, limit, sortOrder }),
    enabled: enabled && !!requirementId,
    staleTime: 30 * 1000,
  });

  const refetchComments = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', requirementId] });
  };

  return {
    comments: query.data?.data?.comments ?? [],
    pagination: query.data?.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    refetchComments
  };
};

export default useComments;
