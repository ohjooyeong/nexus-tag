import axiosInstance from '@/config/axios-instance';
import { dashboardQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';
import { useParams } from 'next/navigation';

interface DashboardOverview {
  total: number;
  new: number;
  inProgress: number;
  toReview: number;
  done: number;
  completed: number;
  skipped: number;
}

export default function useDashboardOverview() {
  const params = useParams();
  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;

  const { isLoading, isError, data, error } = useQuery<
    DashboardOverview,
    AxiosError<ApiError>
  >({
    queryKey: dashboardQueries.overview(projectId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/dashboard/overview`,
      );

      return data.data;
    },
  });

  return { isLoading, isError, data, error };
}
