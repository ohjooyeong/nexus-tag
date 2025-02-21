import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type CreateDataset = {
  name: string;
  workspaceId: string;
  projectId: string;
};

export default function useCreateDataset() {
  const mutate = useMutation({
    mutationFn: async ({ name, workspaceId, projectId }: CreateDataset) => {
      const { data } = await axiosInstance.post(
        `/workspaces/${workspaceId}/projects/${projectId}/datasets`,
        {
          name,
        },
      );
      return data;
    },
  });
  return mutate;
}
