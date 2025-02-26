import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type UpdateDataItem = {
  dataItemId: string;
  name: string;
};

export default function useUpdateDataItem() {
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  const mutate = useMutation({
    mutationFn: async ({ name, dataItemId }: UpdateDataItem) => {
      const { data } = await axiosInstance.put(
        `/workspaces/${workspaceId}/projects/${projectId}/items/${dataItemId}`,
        {
          name,
        },
      );
      return data;
    },
  });
  return mutate;
}
