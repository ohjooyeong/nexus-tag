'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import AddMemberSheet from './sheet/add-member-sheet';
import { useState } from 'react';
import useWorkspaceMyRole from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-my-role';

interface UserTableToolbarProps<TMember> {
  table: Table<TMember>;
}

export function UserTableToolbar<TMember>({
  table,
}: UserTableToolbarProps<TMember>) {
  const { data: currentMyRole } = useWorkspaceMyRole();

  const isMyRoleOwner = currentMyRole === 'OWNER';

  const [showAddMemberSheet, setShowAddMemberSheet] = useState(false);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search name..."
          value={
            (table.getColumn('username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('username')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      {isMyRoleOwner && (
        <div>
          <Button
            variant={'default'}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
              transition"
            onClick={() => {
              setShowAddMemberSheet(true);
            }}
          >
            Add Member
          </Button>
        </div>
      )}
      <AddMemberSheet
        isOpen={showAddMemberSheet}
        onClose={() => setShowAddMemberSheet(false)}
      />
    </div>
  );
}
