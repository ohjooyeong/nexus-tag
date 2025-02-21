import axiosInstance from '@/config/axios-instance';
import { datasetQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function useDatasetStats() {
  const params = useParams();
  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: datasetQueries.detail(projectId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/datasets/stats`,
      );

      return data.data;
    },
  });

  return { isLoading, isError, data };
}
