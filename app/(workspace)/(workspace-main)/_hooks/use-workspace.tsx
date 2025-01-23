import axiosInstance from '@/config/axios-instance';
import { useQuery } from '@tanstack/react-query';

export default function useWorkspace(workspaceId: string) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/workspace/${workspaceId}`);

      return data.data;
    },
  });

  return { isLoading, isError, data };
}
