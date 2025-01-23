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

import WorkspaceSwitcher from './workspace-switcher';

// This is sample data.
const data = {
  navMain: [
    {
      title: '',
      url: '#',
      items: [
        {
          title: 'Projects',
          url: '#',
        },
      ],
    },

    {
      title: 'Settings',
      url: '#',
      items: [
        {
          title: 'Members',
          url: '#',
        },
        {
          title: 'Payment',
          url: '#',
        },
      ],
    },
    {
      title: 'Help & Support',
      url: '#',
      items: [
        {
          title: 'Documents',
          url: '#',
        },
        {
          title: 'Contact us',
          url: '#',
        },
      ],
    },
  ],
};

export function WorkspaceSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="py-0 h-[64px] flex justify-center items-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <WorkspaceSwitcher />
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
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
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
