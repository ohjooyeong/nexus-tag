'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassesPanel from './classes-panel/classes-panel';

const AnnotateMain = () => {
  return (
    <div className="flex flex-1 h-full overflow-hidden relative">
      <div className="flex flex-grow flex-shrink flex-col touch-none overscroll-x-none"></div>
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
