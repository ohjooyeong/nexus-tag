import axiosInstance from '@/config/axios-instance';
import { workspaceQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function useWorkspaceList() {
  const params = useParams();
  const workspaceId = params.workspace_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: workspaceQueries.list(workspaceId),
    queryFn: async () => {
      const { data } = await axiosInstance.get('/workspaces');

      return data.data;
    },
  });

  return { isLoading, isError, data };
}
