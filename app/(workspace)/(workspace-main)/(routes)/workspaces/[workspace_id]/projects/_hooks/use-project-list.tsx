import axiosInstance from '@/config/axios-instance';
import { projectQueries } from '@/constants/querykey-factory';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export default function useProjectList(
  workspaceId: string,
  search?: string,
  page: number = 1,
  limit: number = 20,
  order: 'asc' | 'desc' = 'desc',
) {
  const { isLoading, isError, data } = useQuery({
    queryKey: projectQueries.list(workspaceId, search, page, limit, order),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('workspaceId', workspaceId);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('order', order);

      const { data } = await axiosInstance.get(
        `/projects?${params.toString()}`,
      );

      return data.data;
    },
    placeholderData: keepPreviousData,
    /*
    Placeholderdata 옵션은 결국 가짜 데이터를 현재 바뀐 데이터 패칭의 데이터를 다 불러오기 전까지 보여주는 행위인 것이다.
    이걸 keepPreviousData를 활용해서 기존 캐시된 데이터를 활용하겠다고 선언해 주는 것이다.
    이는 아마도 react의 useDifferedValue라는 훅을 참조했다고 전한다.
  */
  });

  return { isLoading, isError, data };
}
