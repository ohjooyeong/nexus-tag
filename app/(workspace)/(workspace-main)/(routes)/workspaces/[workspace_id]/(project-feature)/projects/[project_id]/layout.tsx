import { cookies } from 'next/headers';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { ProjectSidebar } from './_components/project-sidebar';
import { ProjectNavActions } from './_components/project-nav-actions';
import ProjectBradcrumb from './_components/project-breadcrumb';

function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <ProjectSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ProjectBradcrumb />
          </div>
          <div className="ml-auto px-6">
            <ProjectNavActions />
          </div>
        </header>
        <div className="mx-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;
