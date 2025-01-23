'use client';

import { Spinner } from '@/components/spinner';
import axiosInstance from '@/config/axios-instance';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

const WorkspacesPage = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const getDefaultWorkspace = async () => {
      try {
        const { data } = await axiosInstance.get(
          '/workspace/default-workspace',
        );
        if (data) {
          router.replace(`/workspaces/${data.data.id}/projects`);
        }
      } catch (error) {
        console.error(error);
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
