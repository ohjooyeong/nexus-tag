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
} from '@/components/ui/sidebar';
import {
  BrushIcon,
  HandIcon,
  MousePointer,
  Pentagon,
  Square,
  ZapIcon,
} from 'lucide-react';
import { ImageMenuDrop } from './image-menu-drop';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useParams } from 'next/navigation';

export function AnnotateSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { project_id: projectId, workspace_id: workspaceId } = useParams();

  const data = React.useMemo(
    () => ({
      navMain: [
        {
          title: 'Manual',
          url: '#',
          items: [
            {
              title: 'Pan',
              url: '#',
              icon: HandIcon,
            },
            {
              title: 'Select & Drag',
              url: '#',
              icon: MousePointer,
            },
          ],
        },
        {
          title: 'AI Tool',
          url: '#',
          items: [
            {
              title: 'SAM Brush',
              url: '#',
              icon: ZapIcon,
            },
          ],
        },
        {
          title: 'Basic Tool',
          url: '#',
          items: [
            {
              title: 'Polygon',
              url: '#',
              icon: Pentagon,
            },
            {
              title: 'Bounding Box',
              url: '#',
              icon: Square,
            },
            {
              title: 'Brush',
              url: '#',
              icon: BrushIcon,
            },
          ],
        },
      ],
    }),
    [],
  );

  const menuData = React.useMemo(
    () => [
      {
        title: 'Go to workspaces',
        url: `/workspaces/${workspaceId}/projects`,
      },
      {
        title: 'Go to project',
        url: `/workspaces/${workspaceId}/projects/${projectId}/dashboard`,
      },
    ],
    [],
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="flex items-center justify-center"
            >
              <ImageMenuDrop menuItem={menuData} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="flex items-center justify-center text-center mb-2">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton className="w-full h-10 flex items-center justify-center border rounded-lg">
                          <item.icon className="w-full h-10" />
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent>{item.title}</TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
