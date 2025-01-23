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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, LayersIcon, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import useWorkspaceList from '../_hooks/use-workspace-list';
import useWorkspace from '../_hooks/use-workspace';
import { Workspace } from '../_types';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
}) => (
  <CommandList>
    <CommandEmpty>No workspace found.</CommandEmpty>
    <CommandGroup heading="Workspace">
      {workspaceList?.map((workspace) => (
        <CommandItem
          key={workspace.id}
          onSelect={() => onSelect(workspace)}
          className={cn(
            'text-sm truncate',
            selectedWorkspace?.id === workspace.id && 'text-blue-500',
          )}
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

const NewWorkspaceDialog = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    {children}
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Workspace</DialogTitle>
        <DialogDescription>
          Add a new workspace to manage products and customers.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <Label htmlFor="name">Workspace name</Label>
          <Input id="name" placeholder="Please enter the new workspace name." />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
            transition"
        >
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const WorkspaceSwitcher = () => {
  const { workspace_id: workspaceId } = useParams();
  const [open, setOpen] = useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );

  const { data: workspaceList } = useWorkspaceList();
  const { data: currentWorkspace } = useWorkspace(workspaceId as string);

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
          <Command>
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
