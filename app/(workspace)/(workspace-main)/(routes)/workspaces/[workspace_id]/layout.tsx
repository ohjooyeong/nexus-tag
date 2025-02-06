'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import useWorkspaceInfo from '../../../_hooks/use-workspace-info';
import { toast } from 'sonner';
import { ApiError } from 'next/dist/server/api-utils';
import { AxiosError } from 'axios';
import WorkspaceNotFound from '../../../_components/workspace-not-found';
import { Spinner } from '@/components/spinner';

const WorkspaceLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { workspace_id: workspaceId } = useParams();

  const {
    data: workspace,
    error,
    isLoading,
  } = useWorkspaceInfo(workspaceId as string);

  useEffect(() => {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError?.response?.status === 403) {
      toast('You do not have permission to access this workspace.');
      router.replace('/workspaces');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="h-screen">
        <div className="h-full w-full flex items-center justify-center">
          <Spinner size={'icon'} />
        </div>
      </div>
    );
  }

  if (!workspace) {
    return <WorkspaceNotFound />;
  }

  return <>{children}</>;
};

export default WorkspaceLayout;
