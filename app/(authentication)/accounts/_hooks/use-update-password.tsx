import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type UpdatePassword = {
  currentPassword: string;
  newPassword: string;
};

export default function useUpdatePassword() {
  const mutate = useMutation({
    mutationFn: async (context: UpdatePassword) => {
      const { data } = await axiosInstance.post(`/user/password`, {
        currentPassword: context.currentPassword,
        newPassword: context.newPassword,
      });
      return data;
    },
  });
  return mutate;
}
