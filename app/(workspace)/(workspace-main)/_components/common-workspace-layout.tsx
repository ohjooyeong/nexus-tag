import { cookies } from 'next/headers';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { WorkspaceSidebar } from '@/app/(workspace)/(workspace-main)/_components/workspace-siderbar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import NavActions from '@/app/(workspace)/(workspace-main)/_components/nav-actions';

type LayoutProps = {
  breadTitle?: string;
  children: React.ReactNode;
  params: { workspace_id: string };
};

function CommonWorkspaceLayout({
  children,
  breadTitle = 'Projects',
  params,
}: LayoutProps) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <WorkspaceSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href={`/workspaces/${params.workspace_id}/projects`}
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-6">
            <NavActions />
          </div>
        </header>
        <div className="mx-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default CommonWorkspaceLayout;
