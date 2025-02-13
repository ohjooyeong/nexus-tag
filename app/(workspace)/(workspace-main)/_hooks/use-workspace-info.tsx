import axiosInstance from '@/config/axios-instance';
import { workspaceQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';
import { Workspace } from '../_types';

export default function useWorkspaceInfo(workspaceId: string) {
  const { isLoading, isError, data, error } = useQuery<
    Workspace,
    AxiosError<ApiError>
  >({
    queryKey: workspaceQueries.detail(workspaceId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/workspaces/${workspaceId}`);

      return data.data;
    },
  });

  return { isLoading, isError, data, error };
}
