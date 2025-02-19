'use client';

import axiosInstance from '@/config/axios-instance';
import { memberQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function useMemberList() {
  const params = useParams();
  const workspaceId = params.workspace_id as string;

  const { isLoading, isError, data } = useQuery({
    queryKey: memberQueries.list(),
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/members`,
      );

      return data?.data;
    },
  });

  return { isLoading, isError, data };
}
