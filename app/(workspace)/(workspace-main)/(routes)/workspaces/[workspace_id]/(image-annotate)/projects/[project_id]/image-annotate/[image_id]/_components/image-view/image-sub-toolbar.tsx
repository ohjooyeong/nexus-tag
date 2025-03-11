'use client';

import { Button } from '@/components/ui/button';
import { useToolStore } from '../../_store/tool-store';
import { Tool } from '../../_types/types';
import { ChevronLeft, Trash2Icon } from 'lucide-react';
import { useSelectedLabelsStore } from '../../_store/label-collection/selected-labels-store';
import { useLabelsStore } from '../../_store/label-collection/labels-store';

const ImageSubToolbar = () => {
  const { setToolId, getToolId } = useToolStore();
  const { deleteLabels } = useLabelsStore();
  const { getSelectedLabelIds, resetSelection } = useSelectedLabelsStore();
  const currentTool = getToolId();
  const selectedLabels = getSelectedLabelIds();
  const lenSelectedLabels = selectedLabels.length;

  const handleDeleteLabels = () => {
    deleteLabels(selectedLabels);
    resetSelection();
  };

  const handleBackToSelection = () => {
    setToolId(Tool.Selection);
  };

  const renderToolbarContent = () => {
    switch (currentTool) {
      case Tool.Bbox:
        return null;
      case Tool.Selection:
        if (lenSelectedLabels > 0) {
          return (
            <div className="text-gray-600 flex items-center">
              <p className="text-sm mr-1">
                {lenSelectedLabels}
                {lenSelectedLabels === 1
                  ? ` label selected`
                  : ` labels selected`}
              </p>
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={handleDeleteLabels}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="h-[52px] flex items-center overflow-hidden relative px-2">
      {currentTool !== Tool.Selection && (
        <Button
          className="w-8 h-8 text-gray-800 hover:text-blue-500"
          variant={'ghost'}
          size={'icon'}
          onClick={handleBackToSelection}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}
      {renderToolbarContent()}
    </div>
  );
};

export default ImageSubToolbar;
