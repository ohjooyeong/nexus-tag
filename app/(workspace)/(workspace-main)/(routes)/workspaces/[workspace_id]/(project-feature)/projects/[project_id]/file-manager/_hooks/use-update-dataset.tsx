import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type UpdateDataset = {
  datasetId: string;
  name: string;
};

export default function useUpdateDataset() {
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  const mutate = useMutation({
    mutationFn: async ({ name, datasetId }: UpdateDataset) => {
      const { data } = await axiosInstance.put(
        `/workspaces/${workspaceId}/projects/${projectId}/datasets/${datasetId}`,
        {
          name,
        },
      );
      return data;
    },
  });
  return mutate;
}
