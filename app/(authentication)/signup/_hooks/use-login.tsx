import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type SignUp = {
  email: string;
  password: string;
  birthdate: string;
  username: string;
};

export default function useSignUp() {
  const mutate = useMutation({
    mutationFn: async (context: SignUp) => {
      const { data } = await axiosInstance.post(`/auth/register`, context);
      return data;
    },
  });

  return mutate;
}
