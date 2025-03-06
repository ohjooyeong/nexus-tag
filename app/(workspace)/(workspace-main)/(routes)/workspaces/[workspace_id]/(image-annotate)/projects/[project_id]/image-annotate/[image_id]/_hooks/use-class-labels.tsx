import axiosInstance from '@/config/axios-instance';
import { classLabelQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useClassLabelStore } from '../_store/class-label-store';

export default function useClassLabels() {
  const params = useParams();
  const { setActiveClassLabel } = useClassLabelStore();

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

  useEffect(() => {
    if (data && data.length > 0) {
      setActiveClassLabel(data[0]);
    }
  }, [data, setActiveClassLabel]);

  return { isLoading, isError, data };
}
