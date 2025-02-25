import axiosInstance from '@/config/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

type UploadImages = {
  datasetId: string;
  files: File[];
};

export default function useUploadImages() {
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  const mutate = useMutation({
    mutationFn: async ({ datasetId, files }: UploadImages) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const { data } = await axiosInstance.post(
        `/workspaces/${workspaceId}/projects/${projectId}/datasets/${datasetId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return data;
    },
  });
  return mutate;
}
