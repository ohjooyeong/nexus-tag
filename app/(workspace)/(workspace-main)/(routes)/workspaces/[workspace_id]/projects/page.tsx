'use client';

import ProjectCard from '@/app/(workspace)/(workspace-main)/_components/project-card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Search } from 'lucide-react';

const ProjectsPage = () => {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9">
          <h1 className="text-2xl font-bold">Projects</h1>
          <div className="flex gap-3">
            <div
              className="px-3 py-[2px] flex items-center justify-between gap-2 border border-gray-400
                hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              <Search className="opacity-50" />
              <input
                className="flex h-6 w-full rounded-md bg-transparent py-3 text-sm outline-none
                  placeholder:text-muted-foreground disabled:cursor-not-allowed
                  disabled:opacity-50"
                placeholder="Find matching projects"
                cmdk-input=""
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                aria-autocomplete="list"
                type="text"
                value=""
              />
            </div>
            <Button
              variant={'default'}
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
                transition"
            >
              <PlusIcon />
              <span>New Project</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
