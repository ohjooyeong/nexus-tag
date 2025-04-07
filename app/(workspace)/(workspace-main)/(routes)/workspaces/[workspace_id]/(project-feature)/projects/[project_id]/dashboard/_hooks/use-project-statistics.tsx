import axiosInstance from '@/config/axios-instance';
import { dashboardQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function useProjectStatistics() {
  const params = useParams();
  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: dashboardQueries.statistics(projectId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/dashboard/statistics`,
      );

      return data?.data;
    },
    refetchInterval: 30000,
  });

  return { isLoading, isError, data, error };
}
