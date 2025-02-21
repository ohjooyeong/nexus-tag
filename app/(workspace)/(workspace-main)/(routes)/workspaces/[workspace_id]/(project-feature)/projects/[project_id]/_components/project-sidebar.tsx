'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Airplay,
  Download,
  Folder,
  GalleryVerticalEnd,
  Pickaxe,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import useWorkspaceInfo from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-info';

export function ProjectSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop();
  const { workspace_id: workspaceId, project_id: projectId } = useParams();
  const { data: currentWorkspace } = useWorkspaceInfo(workspaceId as string);

  const data = React.useMemo(() => {
    return {
      navMain: [
        {
          title: '',
          url: '#',
          items: [
            {
              title: 'Dashboard',
              url: `/workspaces/${workspaceId}/projects/${projectId}/dashboard`,
              icon: Airplay,
              keyword: 'dashboard',
            },
          ],
        },
        {
          title: 'Content',
          url: '#',
          items: [
            {
              title: 'File Manager',
              url: `/workspaces/${workspaceId}/projects/${projectId}/file-manager`,
              icon: Folder,
              keyword: 'file-manager',
            },
            {
              title: 'Export data',
              url: '#',
              icon: Download,
              keyword: 'export',
            },
          ],
        },
        {
          title: 'Settings',
          url: '#',
          items: [
            {
              title: 'Project Setup',
              url: '#',
              icon: Pickaxe,
              keyword: 'setup',
            },
          ],
        },
      ],
    };
  }, [pathname, workspaceId]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/workspaces/${currentWorkspace?.id}/projects`}>
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg
                    bg-sidebar-primary text-sidebar-primary-foreground"
                >
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none truncate">
                  <span className="font-semibold truncate">
                    {currentWorkspace?.name}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive = item.keyword === currentPath;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        variant={isActive ? 'default' : 'ghost'}
                      >
                        <Link
                          href={item.url}
                          className={cn(
                            'h-8 rounded-md px-3 text-xs font-semibold',
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
