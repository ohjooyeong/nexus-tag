import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { LabelClassType } from '../_types/label-class';

type UpdateClassLabel = {
  name: string;
  description?: string;
  type: LabelClassType;
  color: string;
  workspaceId: string;
  projectId: string;
  classLabelId: string;
};

export default function useUpdateClassLabel() {
  const mutate = useMutation({
    mutationFn: async ({
      name,
      description,
      type,
      color,
      workspaceId,
      projectId,
      classLabelId,
    }: UpdateClassLabel) => {
      const { data } = await axiosInstance.put(
        `/workspaces/${workspaceId}/projects/${projectId}/class-labels/${classLabelId}`,
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
