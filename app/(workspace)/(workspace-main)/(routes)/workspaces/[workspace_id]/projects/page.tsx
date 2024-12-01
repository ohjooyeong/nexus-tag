import WorkspaceCard from '@/app/(workspace)/(workspace-main)/_components/workspace-card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Search } from 'lucide-react';

const ProjectsPage = () => {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <div className="flex gap-3">
            <div
              className="px-3 py-[6px] flex items-center justify-between gap-2 border border-gray-400
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
            <Button variant={'default'}>
              <PlusIcon />
              <span>New Project</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
