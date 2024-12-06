import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AnnotateSidebar } from './_components/annotate-sidebar';
import { AnnotateNavActions } from './_components/annotate-nav-actions';

const ImageAnnotatePage = () => {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '5rem',
        } as React.CSSProperties
      }
      open
    >
      <AnnotateSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-6"></div>
          <div className="ml-auto px-6">
            <AnnotateNavActions />
          </div>
        </header>
        <div className=""></div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ImageAnnotatePage;
