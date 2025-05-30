import axiosInstance from '@/config/axios-instance';
import { workspaceQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function useWorkspaceMyRole() {
  const params = useParams();
  const workspaceId = params.workspace_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: workspaceQueries.myRole(workspaceId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/my-role`,
      );

      return data.data;
    },
  });

  return { isLoading, isError, data };
}
