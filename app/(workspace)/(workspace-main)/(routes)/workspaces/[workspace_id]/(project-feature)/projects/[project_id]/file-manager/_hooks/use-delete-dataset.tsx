import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type DeleteDatasetParams = {
  datasetId: string;
};

export default function useDeleteDataset() {
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  return useMutation({
    mutationFn: async ({ datasetId }: DeleteDatasetParams) => {
      const { data } = await axiosInstance.delete(
        `/workspaces/${workspaceId}/projects/${projectId}/datasets/${datasetId}`,
      );
      return data;
    },
  });
}
