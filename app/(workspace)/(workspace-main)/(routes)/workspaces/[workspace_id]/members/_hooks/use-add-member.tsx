import { Role } from '@/app/(workspace)/(workspace-main)/_types';
import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type AddMemberParams = {
  email: string;
  role: Role;
  workspaceId: string;
};

export default function useAddMember() {
  return useMutation({
    mutationFn: async ({ email, role, workspaceId }: AddMemberParams) => {
      const { data } = await axiosInstance.post(
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
