'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ApiError } from 'next/dist/server/api-utils';
import { AxiosError } from 'axios';

import { Spinner } from '@/components/spinner';

import ProjectNotFound from './project-not-found';
import useProjectInfo from '../_hooks/use-project-info';

interface ProjectLayoutClientProps {
  children: React.ReactNode;
}

const ProjectLayoutClient = ({ children }: ProjectLayoutClientProps) => {
  const { project_id: projectId } = useParams();
  const router = useRouter();
  const {
    data: project,
    error,
    isLoading,
  } = useProjectInfo(projectId as string);

  useEffect(() => {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError?.response?.status === 403) {
      toast('You do not have permission to access this project.');
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

  if (!project) {
    return <ProjectNotFound />;
  }

  return <>{children}</>;
};

export default ProjectLayoutClient;
