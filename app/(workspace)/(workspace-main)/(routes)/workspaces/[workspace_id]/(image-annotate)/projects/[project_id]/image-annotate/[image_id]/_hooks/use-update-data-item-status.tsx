import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';

type UpdateDataItemStatus = {
  workspaceId: string;
  projectId: string;
  imageId: string;
  status: string;
};

export default function useUpdateDataItemStatus() {
  const mutate = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      imageId,
      status,
    }: UpdateDataItemStatus) => {
      const { data } = await axiosInstance.patch(
        `/workspaces/${workspaceId}/projects/${projectId}/items/${imageId}/status`,
        {
          status,
        },
      );
      return data;
    },
  });
  return mutate;
}
