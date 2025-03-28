import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type UpdateProject = {
  name: string;
  description: string;
  workspaceId: string;
  projectId: string;
};

export default function useUpdateProject() {
  const mutate = useMutation({
    mutationFn: async (context: UpdateProject) => {
      const { data } = await axiosInstance.put(
        `/workspaces/${context.workspaceId}/projects/${context.projectId}`,
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
