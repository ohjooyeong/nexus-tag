'use client';

import { Spinner } from '@/components/spinner';
import axiosInstance from '@/config/axios-instance';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { toast } from 'sonner';

const WorkspacesPage = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const getDefaultWorkspace = async () => {
      try {
        const { data } = await axiosInstance.get(
          '/workspaces/default-workspace',
        );
        if (data) {
          router.replace(`/workspaces/${data.data.id}/projects`);
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
    getDefaultWorkspace();
  }, [router]);

  return (
    <div className="h-screen">
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size={'icon'} />
      </div>
    </div>
  );
};

export default WorkspacesPage;
