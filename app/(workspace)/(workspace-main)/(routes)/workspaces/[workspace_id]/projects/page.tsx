'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon, Search, XIcon } from 'lucide-react';
import ProjectList from './_components/project-list';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useProjectList from './_hooks/use-project-list';
import NewProjectDialog from '@/app/(workspace)/(workspace-main)/_components/dialog/new-project-dialog';

const ProjectsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get('term') || '';
  const { workspace_id: workspaceId } = useParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [query, setQuery] = useState(initialSearch);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  useEffect(() => {
    if (query) {
      router.replace(`?search=${query}`);
    } else {
      router.replace(`?`);
    }
  }, [query, router]);

  const { data, isLoading } = useProjectList(
    workspaceId as string,
    query,
    1,
    20,
  );

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setQuery(searchTerm);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setQuery('');
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9 gap-2">
          <h1 className="text-2xl font-bold">Projects</h1>
          <div className="flex gap-3">
            <div className="items-center gap-2 hidden sm:flex">
              <span className="text-blue-500 text-sm">{`${data?.total ?? 0} results`}</span>
              {query && (
                <div
                  className="flex items-center gap-1 text-sm cursor-pointer"
                  onClick={handleReset}
                >
                  Reset <XIcon className="w-3 h-3" />
                </div>
              )}
            </div>
            <div
              className="px-3 py-[2px] flex items-center justify-between gap-2 border border-gray-400
                hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              <Search className="opacity-50" />
              <input
                className="flex h-6 w-full rounded-md bg-transparent py-3 text-sm outline-none
                  placeholder:text-muted-foreground disabled:cursor-not-allowed
                  disabled:opacity-50"
                placeholder="Search projects"
                cmdk-input=""
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                aria-autocomplete="list"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <Button
              variant={'default'}
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
                transition"
              onClick={() => {
                setShowNewProjectDialog(true);
              }}
            >
              <PlusIcon />
              <span>New Project</span>
            </Button>
          </div>
        </div>
        <ProjectList isLoading={isLoading} data={data} />
      </div>
      <NewProjectDialog
        isOpen={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
      />
    </div>
  );
};

export default ProjectsPage;
