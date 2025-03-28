import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type Login = {
  email: string;
  password: string;
};

type LoginResponse = {
  statusCode: number;
  message: string;
  data: { access_token: string; expires_at: number; expires_in: number };
};

export default function useLogin() {
  const mutate = useMutation({
    mutationFn: async (context: Login) => {
      const { data } = await axiosInstance.post<LoginResponse>(
        `/auth/login`,
        context,
      );
      return data.data;
    },
  });

  return mutate;
}
