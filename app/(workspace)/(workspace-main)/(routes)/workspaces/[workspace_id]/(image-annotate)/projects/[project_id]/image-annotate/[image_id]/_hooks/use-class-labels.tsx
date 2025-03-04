import axiosInstance from '@/config/axios-instance';
import { classLabelQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { LabelClassType } from '../_types/label-class';

export default function useClassLabels(type: LabelClassType) {
  const params = useParams();

  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;
  const itemId = params.image_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: classLabelQueries.list(itemId, type),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('type', type);

      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/labels/${itemId}?${params.toString()}`,
      );

      return data.data;
    },
    enabled: !!itemId,
  });

  return { isLoading, isError, data };
}
