import axiosInstance from '@/config/axios-instance';
import { workspaceQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';

export default function useWorkspaceInfo(workspaceId: string) {
  const { isLoading, isError, data } = useQuery({
    queryKey: workspaceQueries.detail(workspaceId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/workspace/${workspaceId}`);

      return data.data;
    },
  });

  return { isLoading, isError, data };
}
