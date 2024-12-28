'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassesPanel from './classes-panel/classes-panel';
import ImageViewContainer from './image-view/image-view-container';

type AnnotateMainProps = {
  params: { project_id: string };
};

const AnnotateMain = ({ params }: AnnotateMainProps) => {
  return (
    <div className="flex flex-1 h-full overflow-hidden relative">
      <div className="flex flex-grow flex-shrink flex-col touch-none overscroll-x-none">
        <ImageViewContainer params={params} />
      </div>
      <Tabs defaultValue="annotation" className="w-[340px] mt-2">
        <TabsList>
          <TabsTrigger value="annotation">Annotation</TabsTrigger>
        </TabsList>
        <TabsContent value="annotation" className="h-full">
          <ClassesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnnotateMain;
