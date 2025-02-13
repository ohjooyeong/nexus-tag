import axiosInstance from '@/config/axios-instance';
import { workspaceQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';

export default function useWorkspaceList() {
  const { isLoading, isError, data } = useQuery({
    queryKey: workspaceQueries.list(),
    queryFn: async () => {
      const { data } = await axiosInstance.get('/workspaces');

      return data.data;
    },
  });

  return { isLoading, isError, data };
}
