'use client';

import { Button } from '@/components/ui/button';
import { useToolStore } from '../../_store/tool-store';
import { Tool } from '../../_types/types';
import { ChevronLeft } from 'lucide-react';

const ImageSubToolbar = () => {
  const { setToolId, getToolId } = useToolStore();
  const currentTool = getToolId();

  const handleBackToSelection = () => {
    setToolId(Tool.Selection);
  };

  const renderBboxToolbar = () => (
    <Button
      className="w-8 h-8 text-gray-800 hover:text-blue-500"
      variant={'ghost'}
      size={'icon'}
      onClick={handleBackToSelection}
    >
      <ChevronLeft className="w-8 h-8" />
    </Button>
  );

  const renderToolbarContent = () => {
    switch (currentTool) {
      case Tool.Bbox:
        return renderBboxToolbar();
      default:
        return null;
    }
  };

  return (
    <div className="h-[52px] flex items-center overflow-hidden relative px-2">
      {renderToolbarContent()}
    </div>
  );
};

export default ImageSubToolbar;
