'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useParams } from 'next/navigation';
import useProjectInfo from '../../../../_hooks/use-project-info';
import useWorkspaceInfo from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-info';
import Link from 'next/link';

const ProjectBradcrumb = () => {
  const { project_id: projectId, workspace_id: workspaceId } = useParams();
  const { data: currentProjectInfo } = useProjectInfo(projectId as string);
  const { data: currentWorkspaceInfo } = useWorkspaceInfo(
    workspaceId as string,
  );

  return (
    <Breadcrumb className="hidden lg:block">
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={`/workspaces/${workspaceId}/projects`}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="max-w-[180px] truncate">
          <BreadcrumbPage className="truncate hover:text-blue-400/80">
            <Link href={`/workspaces/${currentWorkspaceInfo?.id}/projects`}>
              {currentWorkspaceInfo?.name}
            </Link>
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="max-w-[180px] truncate">
          <BreadcrumbPage className="truncate hover:text-blue-400/80">
            <Link
              href={`/workspaces/${currentWorkspaceInfo?.id}/projects/${currentProjectInfo?.id}/dashboard`}
            >
              {currentProjectInfo?.name}
            </Link>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ProjectBradcrumb;
