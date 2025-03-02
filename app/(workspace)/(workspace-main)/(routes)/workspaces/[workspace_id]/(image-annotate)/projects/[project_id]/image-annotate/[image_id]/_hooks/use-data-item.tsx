import axiosInstance from '@/config/axios-instance';
import { datasetQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';

export default function useDataItem() {
  const params = useParams();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId') as string;
  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: datasetQueries.detail(projectId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/items/${itemId}`,
      );

      return data.data;
    },
    enabled: !!itemId,
  });

  return { isLoading, isError, data };
}
