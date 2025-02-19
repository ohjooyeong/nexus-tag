'use client';

import * as React from 'react';
import { BellIcon, PlayIcon, PowerOffIcon, User, UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const data = [
  [
    {
      label: 'My Account',
      icon: User,
    },
    {
      label: 'Logout',
      icon: PowerOffIcon,
    },
  ],
];

export function ProjectNavActions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="mr-8">
        <Button
          variant="default"
          size="sm"
          className="h-10 mx-2 text-sm"
          asChild
        >
          <Link
            href={`/workspaces/${workspaceId}/projects/${projectId}/image-annotate`}
          >
            <span>Start Annotating</span>
            <PlayIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
        <BellIcon />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 data-[state=open]:bg-accent rounded-full"
          >
            <span
              className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8 items-center
                justify-center"
            >
              <UserIcon className="h-6 w-6" />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              <div className="px-4 pt-3 pb-1 text-sm font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none pb-1">
                    Ohjoo
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    brb1111@naver.com
                  </p>
                </div>
              </div>
              <Separator />

              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
