import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AnnotateSidebar } from './_components/annotate-sidebar';
import AnnotateImageInfo from './_components/annotate-image-info';
import { AnnotateNavActions } from './_components/annotate-nav-actions';
import AnnotateMain from './_components/annotate-main';
import AnnotateAction from './_components/annotate-action';

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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between">
          <div className="flex items-center">
            <AnnotateImageInfo />
          </div>
          <div className="flex items-center">
            <AnnotateAction />
          </div>
          <div className="px-6">
            <AnnotateNavActions />
          </div>
        </header>
        <AnnotateMain />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ImageAnnotatePage;
