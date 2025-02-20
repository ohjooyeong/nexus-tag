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
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PhoneCall, Pickaxe, Presentation, Users2Icon } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

export function WorkspaceSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop();
  const { workspace_id: workspaceId } = useParams();

  const data = React.useMemo(() => {
    return {
      navMain: [
        {
          title: 'Content',
          url: '#',
          items: [
            {
              title: 'Projects',
              url: `/workspaces/${workspaceId}/projects`,
              icon: Presentation,
              keyword: 'projects',
            },
          ],
        },

        {
          title: 'Settings',
          url: '#',
          items: [
            {
              title: 'Members',
              url: `/workspaces/${workspaceId}/members`,
              icon: Users2Icon,
              keyword: 'members',
            },
            {
              title: 'General',
              url: `/workspaces/${workspaceId}/general`,
              icon: Pickaxe,
              keyword: 'general',
            },
            // {
            //   title: 'Payment',
            //   url: '#',
            //   icon: CircleDollarSignIcon,
            //   variants: 'payment',
            // },
          ],
        },
        {
          title: 'Help & Support',
          url: '#',
          items: [
            // {
            //   title: 'Documents',
            //   url: `/workspaces/${workspaceId}/documents`,
            //   icon: FileSearch2,
            //   keyword: 'documents',
            // },
            {
              title: 'Contact us',
              url: `#`,
              icon: PhoneCall,
              keyword: 'contact',
            },
          ],
        },
      ],
    };
  }, [pathname, workspaceId]);

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
