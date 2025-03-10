import axiosInstance from '@/config/axios-instance';
import { useQuery } from '@tanstack/react-query';
import { useLabelsStore } from '../_store/label-collection/labels-store';
import { labelsQueries } from '@/constants/querykey-factory';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export const useInitialLabels = () => {
  const initializeLabels = useLabelsStore((state) => state.initializeLabels);
  const params = useParams();
  const workspaceId = params.workspace_id as string;
  const projectId = params.project_id as string;
  const imageId = params.image_id as string;

  // 초기 로딩만 React Query로 처리
  const { data, isLoading, isError } = useQuery({
    queryKey: labelsQueries.list(imageId),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/projects/${projectId}/items/${imageId}/labels`,
      );
      return data.data;
    },
  });

  // React Query에서 받아온 데이터를 Zustand로 처리
  useEffect(() => {
    if (data) {
      initializeLabels(data);
    }
  }, [data]);

  return {
    isLoading,
    isError,
  };
};
