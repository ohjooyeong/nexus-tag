'use client';

import {
  Project,
  ProjectsResponse,
} from '@/app/(workspace)/(workspace-main)/_types';
import ProjectCard from './project-card';
import NoResults from '../../../../../_components/no-results';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

type Props = {
  isLoading: boolean;
  data: ProjectsResponse;
  handlePageChange: (newPage: number) => void;
  page: number;
  totalPages: number;
};

const ProjectList = ({
  isLoading,
  data,
  handlePageChange,
  page,
  totalPages,
}: Props) => {
  return (
    <>
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
      <div className="flex items-center justify-center py-4 min-h-8">
        <Pagination className={cn(totalPages === 1 && 'hidden')}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && handlePageChange(page - 1)}
                className={
                  page <= 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= page - 1 && pageNumber <= page + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && handlePageChange(page + 1)}
                className={
                  page >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default ProjectList;
