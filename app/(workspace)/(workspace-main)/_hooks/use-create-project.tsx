import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { Content_Type } from '../_types';

type CreateProject = {
  name: string;
  description: string;
  contentType?: Content_Type;
  workspaceId: string;
};

export default function useCreateProject() {
  const mutate = useMutation({
    mutationFn: async ({ name, description, workspaceId }: CreateProject) => {
      const { data } = await axiosInstance.post(
        `/workspaces/${workspaceId}/projects`,
        { name, description },
      );
      return data;
    },
  });
  return mutate;
}
