import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type DeleteClassLabelParams = {
  classLabelId: string;
};

export default function useDeleteClassLabel() {
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  return useMutation({
    mutationFn: async ({ classLabelId }: DeleteClassLabelParams) => {
      const { data } = await axiosInstance.delete(
        `/workspaces/${workspaceId}/projects/${projectId}/class-labels/${classLabelId}`,
      );
      return data;
    },
  });
}
