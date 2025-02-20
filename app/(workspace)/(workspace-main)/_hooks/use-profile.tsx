import axiosInstance from '@/config/axios-instance';
import { userQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';

export default function useProfile() {
  const { isLoading, isError, data } = useQuery({
    queryKey: userQueries.profile(),
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/profile');
      return data.data;
    },

    staleTime: 0,
  });

  return { isLoading, isError, data };
}
