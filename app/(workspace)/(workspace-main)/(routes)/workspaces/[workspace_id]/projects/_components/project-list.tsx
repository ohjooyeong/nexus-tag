'use client';

import {
  Project,
  ProjectsResponse,
} from '@/app/(workspace)/(workspace-main)/_types';
import ProjectCard from './project-card';
import NoResults from '../../../../../_components/no-results';

type Props = {
  isLoading: boolean;
  data: ProjectsResponse;
};

const ProjectList = ({ isLoading, data }: Props) => {
  return (
    <div className="flex flex-wrap gap-6">
      {isLoading && (
        <>
          <ProjectCard.Skeleton />
          <ProjectCard.Skeleton />
          <ProjectCard.Skeleton />
          <ProjectCard.Skeleton />
          <ProjectCard.Skeleton />
          <ProjectCard.Skeleton />
        </>
      )}
      {data?.projects.map((project: Project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      {data?.projects.length === 0 && <NoResults />}
    </div>
  );
};

export default ProjectList;
