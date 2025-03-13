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
import { useToolStore } from '../_store/tool-store';
import { Tool } from '../_types/types';
import { cn } from '@/lib/utils';

export function AnnotateSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { project_id: projectId, workspace_id: workspaceId } = useParams();
  const { setActiveTool, getActiveTool } = useToolStore();
  const activeToolId = getActiveTool();

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
              isDisable: false,
              keyword: Tool.Pan,
              event: () => setActiveTool(Tool.Pan),
            },
            {
              title: 'Select & Drag',
              url: '#',
              icon: MousePointer,
              isDisable: false,
              keyword: Tool.Selection,
              event: () => setActiveTool(Tool.Selection),
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
              isDisable: true,
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
              keyword: Tool.Polygon,
              isDisable: false,
              event: () => setActiveTool(Tool.Polygon),
            },
            {
              title: 'Bounding Box',
              url: '#',
              icon: Square,
              keyword: Tool.Bbox,
              isDisable: false,
              event: () => setActiveTool(Tool.Bbox),
            },
            {
              title: 'Brush',
              url: '#',
              icon: BrushIcon,
              keyword: Tool.Mask,
              isDisable: false,
              event: () => setActiveTool(Tool.Mask),
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
                        <SidebarMenuButton
                          className={cn(
                            'w-full h-10 flex items-center justify-center border rounded-lg',
                            'keyword' in item &&
                              item.keyword === activeToolId &&
                              'bg-slate-200 hover:bg-slate-200',
                          )}
                          disabled={item.isDisable}
                          onClick={() => {
                            if (
                              'keyword' in item &&
                              activeToolId === item.keyword
                            ) {
                              setActiveTool(Tool.Selection);
                              return;
                            }

                            if ('event' in item) {
                              item.event();
                              return;
                            }
                          }}
                        >
                          <item.icon
                            className={cn(
                              'w-full h-10',
                              'keyword' in item &&
                                item.keyword === activeToolId &&
                                'text-blue-600',
                            )}
                          />
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
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
