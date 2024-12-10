'use client';

import * as React from 'react';

import { LayoutGrid } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ImageMenuDropProps {
  menuItem: {
    title: string;
    url: string;
  }[];
}

export function ImageMenuDrop({ menuItem }: ImageMenuDropProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full h-full flex items-center justify-center p-2">
        <LayoutGrid className="w-6 h-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {menuItem.map((account) => (
          <DropdownMenuItem key={account.title}>
            <div
              className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0
                [&_svg]:text-foreground"
            >
              {account.title}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
