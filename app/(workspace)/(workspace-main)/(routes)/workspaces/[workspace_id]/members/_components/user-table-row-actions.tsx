'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import UpdateMemberSheet, {
  MemberFormValues,
} from './sheet/update-member-sheet';
import { useState } from 'react';
import DeleteMemberDialog from './dialog/delete-member-dialog';

interface UserTableRowActionsProps<TMember> {
  row: Row<TMember>;
}

export function UserTableRowActions<TMember>({
  row,
}: UserTableRowActionsProps<TMember>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showUpdateMemberSheet, setShowUpdateMemberSheet] = useState(false);
  const [showDeleteMemberDialog, setShowDeleteMemberDialog] = useState(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            setShowUpdateMemberSheet(true);
            setIsDropdownOpen(false);
          }}
        >
          Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setShowDeleteMemberDialog(true);
            setIsDropdownOpen(false);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <UpdateMemberSheet
        isOpen={showUpdateMemberSheet}
        onClose={() => setShowUpdateMemberSheet(false)}
        data={row.original as MemberFormValues}
      />
      <DeleteMemberDialog
        isOpen={showDeleteMemberDialog}
        onClose={() => setShowDeleteMemberDialog(false)}
        data={row.original as MemberFormValues}
      />
    </DropdownMenu>
  );
}
