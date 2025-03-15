import axiosInstance from '@/config/axios-instance';
import { dashboardQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';
import { useParams } from 'next/navigation';

interface DashboardInfo {
  workspaceName: string;
  datasetsCount: number;
  dataItemsCount: number;
  membersCount: number;
  myRole: string;
  createdAt: Date;
}

export default function useDashboardInfo() {
  const params = useParams();
  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;

  const { isLoading, isError, data, error } = useQuery<
    DashboardInfo,
    AxiosError<ApiError>
  >({
    queryKey: dashboardQueries.info(projectId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/dashboard/info`,
      );

      return data.data;
    },
  });

  return { isLoading, isError, data, error };
}
