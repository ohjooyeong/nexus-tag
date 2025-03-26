import axiosInstance from '@/config/axios-instance';
import { dataItemQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function useDataItemNavigation() {
  const params = useParams();

  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;
  const itemId = params.image_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: dataItemQueries.info(itemId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/items/${itemId}/navigation`,
      );

      return data.data;
    },
    enabled: !!itemId,
  });

  return { isLoading, isError, data };
}
