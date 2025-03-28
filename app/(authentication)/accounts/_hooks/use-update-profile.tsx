import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type UpdateProflie = {
  username: string;
  profileImg?: string;
};

export default function useUpdateProfile() {
  const mutate = useMutation({
    mutationFn: async (context: UpdateProflie) => {
      const { data } = await axiosInstance.put(`/user/profile`, {
        username: context.username,
        // profileImg: context.profileImg,
      });
      return data;
    },
  });
  return mutate;
}
