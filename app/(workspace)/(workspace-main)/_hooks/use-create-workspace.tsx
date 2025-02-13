import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type CreateWorkspace = {
  name: string;
};

export default function useCreateWorkspace() {
  const mutate = useMutation({
    mutationFn: async (context: CreateWorkspace) => {
      const { data } = await axiosInstance.post(`/workspaces`, context);
      return data;
    },
  });
  return mutate;
}
