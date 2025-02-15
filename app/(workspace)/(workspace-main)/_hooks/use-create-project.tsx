import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { Content_Type } from '../_types';

type CreateProject = {
  name: string;
  description: string;
  content_type?: Content_Type;
  workspaceId: string;
};

export default function useCreateProject() {
  const mutate = useMutation({
    mutationFn: async (context: CreateProject) => {
      const { data } = await axiosInstance.post(`/projects`, context);
      return data;
    },
  });
  return mutate;
}
