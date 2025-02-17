'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserTableColumnHeader } from './user-table-column-header';
import { Badge } from '@/components/ui/badge';
import { UserTableRowActions } from './user-table-row-actions';
import { Task } from './schema';

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: () => <></>,
    cell: () => <></>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <UserTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] truncate" title={`${row.getValue('username')}`}>
        {row.getValue('username')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <UserTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] truncate" title={`${row.getValue('email')}`}>
        {row.getValue('email')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <UserTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">
            <span className="max-w-[200px] truncate font-medium">
              {row.getValue('role')}
            </span>
          </Badge>
        </div>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <UserTableRowActions row={row} />,
  },
];

export const mobileColumns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: () => <></>,
    cell: () => <></>,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'email',
    header: ({ column }) => (
      <UserTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] truncate" title={`${row.getValue('email')}`}>
        {row.getValue('email')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <UserTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">
            <span className="max-w-[120px] truncate font-medium">
              {row.getValue('role')}
            </span>
          </Badge>
        </div>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <UserTableRowActions row={row} />,
  },
];
