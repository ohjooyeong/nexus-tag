import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { LabelClassType } from '../_types/label-class';

type CreateClassLabel = {
  name: string;
  description?: string;
  type: LabelClassType;
  color: string;
  workspaceId: string;
  projectId: string;
};

export default function useCreateClassLabel() {
  const mutate = useMutation({
    mutationFn: async ({
      name,
      description,
      type,
      color,
      workspaceId,
      projectId,
    }: CreateClassLabel) => {
      const { data } = await axiosInstance.post(
        `/workspaces/${workspaceId}/projects/${projectId}/class-labels`,
        {
          name,
          description,
          type,
          color,
        },
      );
      return data;
    },
  });
  return mutate;
}
