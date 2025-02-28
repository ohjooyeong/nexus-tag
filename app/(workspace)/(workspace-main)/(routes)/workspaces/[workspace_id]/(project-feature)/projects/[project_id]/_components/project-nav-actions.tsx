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
import { useLogout } from '@/app/(workspace)/(workspace-main)/_hooks/use-logout';
import useProfile from '@/app/(workspace)/(workspace-main)/_hooks/use-profile';

import useDatasetStats from '../file-manager/_hooks/use-dataset-stats';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ProjectNavActions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { workspace_id: workspaceId, project_id: projectId } = useParams();
  const { data: profile } = useProfile();
  const { logout } = useLogout();

  const { data: datsetStats } = useDatasetStats();

  const menuItems = React.useMemo(
    () => [
      [
        {
          label: 'My Account',
          icon: User,
          onClick: () => {
            // Add my account action here
            console.log('My Account clicked');
          },
        },
        {
          label: 'Logout',
          icon: PowerOffIcon,
          onClick: () => {
            logout();
            setIsOpen(false);
          },
        },
      ],
    ],
    [],
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="mr-8">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="default"
              size="sm"
              className="h-10 mx-2 text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white
                hover:opacity-80 transition"
              disabled={!datsetStats?.totalItems}
              asChild={datsetStats?.totalItems} // shadcn button asChild 일땐 disabled가 true인 상태 작동이 안되서 이렇게 해줌
            >
              <Link
                className="flex items-center gap-2"
                href={`/workspaces/${workspaceId}/projects/${projectId}/image-annotate`}
              >
                <span>Start Annotating</span>
                <PlayIcon className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          {!datsetStats?.totalItems && (
            <TooltipContent>
              Upload at least one image to start annotating
            </TooltipContent>
          )}
        </Tooltip>
      </div>
      {/* <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
        <BellIcon />
      </Button> */}
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
                    {profile?.username}
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    {profile?.email}
                  </p>
                </div>
              </div>
              <Separator />

              {menuItems.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index} onClick={item.onClick}>
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
