import axiosInstance from '@/config/axios-instance';
import { dataItemQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function useDataItem() {
  const params = useParams();

  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;
  const itemId = params.image_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: dataItemQueries.detail(itemId),
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
