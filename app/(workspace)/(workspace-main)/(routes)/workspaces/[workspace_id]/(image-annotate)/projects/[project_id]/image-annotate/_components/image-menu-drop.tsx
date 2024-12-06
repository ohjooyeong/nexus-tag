'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LayoutGrid } from 'lucide-react';

interface ImageMenuDropProps {
  isCollapsed: boolean;
  menuItem: {
    title: string;
    url: string;
  }[];
}

export function ImageMenuDrop({ isCollapsed, menuItem }: ImageMenuDropProps) {
  return (
    <Select>
      <SelectTrigger
        className={cn(
          `flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full
          [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4
          [&_svg]:shrink-0`,
          isCollapsed &&
            `flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto
            [&>svg]:hidden`,
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder={<LayoutGrid className="w-2 h-2" />}>
          <LayoutGrid className="w-2 h-2" />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {menuItem.map((account) => (
          <SelectItem key={account.title} value={account.title}>
            <div
              className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0
                [&_svg]:text-foreground"
            >
              {account.title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
