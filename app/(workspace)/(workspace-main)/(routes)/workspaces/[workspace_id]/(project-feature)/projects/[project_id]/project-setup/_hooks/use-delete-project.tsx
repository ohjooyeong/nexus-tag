import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type DeleteProject = {
  workspaceId: string;
  projectId: string;
};

export default function useDeleteProject() {
  const mutate = useMutation({
    mutationFn: async (context: DeleteProject) => {
      const { data } = await axiosInstance.delete(
        `/workspaces/${context.workspaceId}/projects/${context.projectId}`,
      );
      return data;
    },
  });
  return mutate;
}
