import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type Login = {
  email: string;
  password: string;
};

export default function useLogin() {
  const mutate = useMutation({
    mutationFn: async (context: Login) => {
      const { data } = await axiosInstance.post(`/auth/login`, context);
      return data;
    },
  });

  return mutate;
}
