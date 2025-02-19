import { Role } from '@/app/(workspace)/(workspace-main)/_types';
import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type UpdateMemberParams = {
  email: string;
  role: Role;
  workspaceId: string;
};

export default function useUpdateMember() {
  return useMutation({
    mutationFn: async ({ email, role, workspaceId }: UpdateMemberParams) => {
      const { data } = await axiosInstance.put(
        `/workspaces/${workspaceId}/members`,
        {
          email,
          role,
        },
      );
      return data;
    },
  });
}
