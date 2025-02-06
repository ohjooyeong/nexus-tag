'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { DialogTrigger } from '@/components/ui/dialog';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, LayersIcon, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import useWorkspaceList from '../_hooks/use-workspace-list';
import useWorkspaceInfo from '../_hooks/use-workspace-info';
import { Workspace } from '../_types';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import NewWorkspaceDialog from './dialog/new-workspace-dialog';

const WorkspaceTrigger = ({
  open,
  selectedWorkspace,
}: {
  open: boolean;
  selectedWorkspace: Workspace | null;
}) => (
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      aria-label="Select a workspace"
      className={cn('w-[230px] justify-between truncate ')}
      title={selectedWorkspace?.name}
    >
      <LayersIcon className="mr-2 h-5 w-5" />
      <span className="truncate">{selectedWorkspace?.name || ''}</span>
      <ChevronsUpDown className="ml-auto opacity-50" />
    </Button>
  </PopoverTrigger>
);

const WorkspaceList = ({
  workspaceList,
  selectedWorkspace,
  onSelect,
}: {
  selectedWorkspace: Workspace | null;
  workspaceList: Workspace[];
  onSelect: (workspace: Workspace) => void;
}) => {
  return (
    <CommandList>
      <CommandEmpty>No workspace found.</CommandEmpty>
      <CommandGroup heading="Workspace">
        {workspaceList?.map((workspace) => (
          <CommandItem
            onSelect={() => onSelect(workspace)}
            className={cn(
              'text-sm truncate',
              selectedWorkspace?.id === workspace.id && 'text-blue-500',
            )}
            key={workspace.id}
            value={workspace.id}
            keywords={[workspace.name]}
            asChild
          >
            <Link href={`/workspaces/${workspace.id}/projects`}>
              <span className="truncate" title={workspace.name}>
                {workspace.name}
              </span>
              <Check
                className={cn(
                  'ml-auto',
                  selectedWorkspace?.id === workspace.id
                    ? 'opacity-100'
                    : 'opacity-0',
                )}
              />
            </Link>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
};

const CreateWorkspaceItem = ({ onCreate }: { onCreate: () => void }) => (
  <CommandList>
    <CommandSeparator />
    <CommandGroup>
      <DialogTrigger asChild>
        <CommandItem onSelect={onCreate} className="cursor-pointer">
          <PlusCircle className="h-5 w-5" />
          Create Workspace
        </CommandItem>
      </DialogTrigger>
    </CommandGroup>
  </CommandList>
);

const WorkspaceSwitcher = () => {
  const { workspace_id: workspaceId } = useParams();
  const [open, setOpen] = useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );

  const { data: workspaceList } = useWorkspaceList();
  const { data: currentWorkspace } = useWorkspaceInfo(workspaceId as string);

  useEffect(() => {
    if (currentWorkspace) {
      setSelectedWorkspace(currentWorkspace);
    }
  }, [currentWorkspace]);

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setOpen(false);
  };

  return (
    <NewWorkspaceDialog
      isOpen={showNewWorkspaceDialog}
      onClose={() => setShowNewWorkspaceDialog(false)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <WorkspaceTrigger open={open} selectedWorkspace={selectedWorkspace} />
        <PopoverContent className="w-[230px] p-0">
          <Command
            filter={(value, search, keywords = []) => {
              const extendValue = keywords.join(' ');
              if (extendValue.toLowerCase().includes(search.toLowerCase())) {
                return 1;
              }
              return 0;
            }}
          >
            <CommandInput placeholder="Search workspace..." />
            <WorkspaceList
              workspaceList={workspaceList}
              selectedWorkspace={selectedWorkspace}
              onSelect={handleWorkspaceSelect}
            />
            <CreateWorkspaceItem
              onCreate={() => {
                setOpen(false);
                setShowNewWorkspaceDialog(true);
              }}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </NewWorkspaceDialog>
  );
};

export default WorkspaceSwitcher;
