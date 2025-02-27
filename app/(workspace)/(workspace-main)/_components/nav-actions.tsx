'use client';

import { BellIcon, PlusIcon, PowerOffIcon, User, UserIcon } from 'lucide-react';

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
import NewProjectDialog from './dialog/new-project-dialog';
import { useMemo, useState } from 'react';
import useWorkspaceMyRole from '../_hooks/use-workspace-my-role';
import useProfile from '../_hooks/use-profile';
import { useLogout } from '../_hooks/use-logout';

const NavActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const { data: currentMyRole } = useWorkspaceMyRole();
  const { data: profile } = useProfile();
  const { logout } = useLogout();
  const menuItems = useMemo(
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
  const isMyRoleOwner = currentMyRole === 'OWNER';

  return (
    <div className="flex items-center gap-2 text-sm">
      {isMyRoleOwner && (
        <div className="hidden sm:block mr-8">
          <Button
            variant="default"
            size="sm"
            className="h-10 mx-2 text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white
              hover:opacity-80 transition"
            onClick={() => {
              setShowNewProjectDialog(true);
            }}
          >
            <PlusIcon />
            <span>New Project</span>
          </Button>
        </div>
      )}

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
      <NewProjectDialog
        isOpen={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
      />
    </div>
  );
};

export default NavActions;
