import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type DeleteWorkspace = {
  workspaceId: string;
};

export default function useDeleteWorkspace() {
  const mutate = useMutation({
    mutationFn: async (context: DeleteWorkspace) => {
      const { data } = await axiosInstance.delete(
        `/workspace/${context.workspaceId}`,
      );
      return data;
    },
  });
  return mutate;
}
