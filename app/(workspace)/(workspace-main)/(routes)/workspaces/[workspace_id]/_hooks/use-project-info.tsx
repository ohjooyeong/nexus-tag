import { Project } from '@/app/(workspace)/(workspace-main)/_types';
import axiosInstance from '@/config/axios-instance';
import { projectQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';

export default function useProjectInfo(projectId: string) {
  const { isLoading, isError, data, error } = useQuery<
    Project,
    AxiosError<ApiError>
  >({
    queryKey: projectQueries.detail(projectId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/projects/${projectId}`);

      return data.data;
    },
  });

  return { isLoading, isError, data, error };
}
