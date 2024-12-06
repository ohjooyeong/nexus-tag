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
  BrushIcon,
  HandIcon,
  MousePointer,
  Pentagon,
  Square,
  ZapIcon,
} from 'lucide-react';
import { ImageMenuDrop } from './image-menu-drop';

// This is sample data.
const data = {
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
          title: 'SAM',
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
};

const menuData = [
  {
    title: 'Go to workspaces',
    url: '#',
  },
  {
    title: 'Go to project dashboard',
    url: '#',
  },
];

export function AnnotateSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
              <ImageMenuDrop menuItem={menuData} isCollapsed />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="flex items-center justify-center text-center mb-2">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <SidebarMenuButton className="w-full h-10 flex items-center justify-center border rounded-lg">
                      <item.icon className="w-full h-10" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
