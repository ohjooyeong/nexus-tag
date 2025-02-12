import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type UpdateWorkspace = {
  name: string;
  description: string;
  workspaceId: string;
};

export default function useUpdateWorkspace() {
  const mutate = useMutation({
    mutationFn: async (context: UpdateWorkspace) => {
      const { data } = await axiosInstance.put(
        `/workspace/${context.workspaceId}`,
        {
          name: context.name,
          description: context.description,
        },
      );
      return data;
    },
  });
  return mutate;
}
