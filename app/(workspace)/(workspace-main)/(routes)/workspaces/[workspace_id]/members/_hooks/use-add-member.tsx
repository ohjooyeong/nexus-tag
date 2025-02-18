import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type AddMemberParams = {
  email: string;
  role: string;
  workspaceId: string;
};

export default function useAddMember() {
  return useMutation({
    mutationFn: async ({ email, role, workspaceId }: AddMemberParams) => {
      const { data } = await axiosInstance.post('/workspaces/members', {
        email,
        role,
        workspaceId,
      });
      return data;
    },
  });
}
