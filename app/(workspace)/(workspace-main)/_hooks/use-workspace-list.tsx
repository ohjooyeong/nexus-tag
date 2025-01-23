import axiosInstance from '@/config/axios-instance';
import { useQuery } from '@tanstack/react-query';

export default function useWorkspaceList() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['workspace', 'list'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/workspace');

      return data.data;
    },
  });

  return { isLoading, isError, data };
}
