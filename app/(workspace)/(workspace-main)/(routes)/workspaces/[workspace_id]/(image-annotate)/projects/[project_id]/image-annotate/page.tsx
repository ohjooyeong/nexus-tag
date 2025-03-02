'use client';

import { Spinner } from '@/components/spinner';
import axiosInstance from '@/config/axios-instance';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { toast } from 'sonner';

const ImageAnnotatePage = () => {
  const router = useRouter();
  const params = useParams();
  const { workspace_id: workspaceId, project_id: projectId } = params;

  useLayoutEffect(() => {
    const getDefaultImage = async () => {
      try {
        const params = new URLSearchParams();

        params.append('page', '1');
        params.append('limit', '1');
        params.append('order', 'desc');
        const { data } = await axiosInstance.get(
          `/workspaces/${workspaceId}/projects/${projectId}/datasets/items`,
        );

        if (data && data.data) {
          router.replace(
            `/workspaces/${workspaceId}/projects/${projectId}/image-annotate/${data?.data.items[0]?.id}`,
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // AxiosError인 경우 처리
          const { status, data } = error.response;
          toast.error(data?.message);
          console.error(`Error ${status}:`, data);
        } else {
          // 기타 에러 처리
          toast.error('An unknown error occurred.');
          console.error(error);
        }
      }
    };
    getDefaultImage();
  }, [router]);

  return (
    <div className="h-screen">
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size={'icon'} />
      </div>
    </div>
  );
};

export default ImageAnnotatePage;
