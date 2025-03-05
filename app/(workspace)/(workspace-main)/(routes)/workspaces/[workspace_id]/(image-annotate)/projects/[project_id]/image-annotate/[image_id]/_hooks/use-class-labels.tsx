import axiosInstance from '@/config/axios-instance';
import { classLabelQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function useClassLabels() {
  const params = useParams();

  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: classLabelQueries.list(projectId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/class-labels`,
      );

      return data.data;
    },
    enabled: !!projectId,
  });

  return { isLoading, isError, data };
}
