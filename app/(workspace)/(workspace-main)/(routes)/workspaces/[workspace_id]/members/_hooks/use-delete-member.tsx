import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type DeleteMemberParams = {
  email: string;
  workspaceId: string;
};

export default function useDeleteMember() {
  return useMutation({
    mutationFn: async ({ email, workspaceId }: DeleteMemberParams) => {
      const { data } = await axiosInstance.delete(
        `/workspaces/${workspaceId}/members`,
        {
          data: {
            email,
          },
        },
      );
      return data;
    },
  });
}
