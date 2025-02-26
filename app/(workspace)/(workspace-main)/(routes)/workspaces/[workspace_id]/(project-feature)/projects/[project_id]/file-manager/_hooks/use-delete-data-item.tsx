import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type DeleteDataItemParams = {
  itemIds: string[];
};

export default function useDeleteDataItem() {
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  return useMutation({
    mutationFn: async ({ itemIds }: DeleteDataItemParams) => {
      const { data } = await axiosInstance.delete(
        `/workspaces/${workspaceId}/projects/${projectId}/items`,
        { data: { itemIds: itemIds } },
      );
      return data;
    },
  });
}
