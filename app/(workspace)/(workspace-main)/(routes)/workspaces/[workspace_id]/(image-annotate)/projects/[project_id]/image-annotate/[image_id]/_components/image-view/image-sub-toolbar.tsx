'use client';

import { Button } from '@/components/ui/button';
import { useToolStore } from '../../_store/tool-store';
import { Tool } from '../../_types/types';
import { ChevronLeft, Trash2Icon, PencilIcon } from 'lucide-react';
import { useSelectedLabelsStore } from '../../_store/label-collection/selected-labels-store';
import { useLabelsStore } from '../../_store/label-collection/labels-store';
import { useMaskStore } from '../../_store/mask-store';
import MaskToolbar from '../../_tools/mask-tool/toolbar/mask-toolbar';

const ImageSubToolbar = () => {
  const { setActiveTool, getActiveTool } = useToolStore();
  const { deleteLabels } = useLabelsStore();
  const { getSelectedLabelIds, getEditedMaskLabel } = useSelectedLabelsStore();
  const { triggerAction, getMaskExists } = useMaskStore();
  const currentTool = getActiveTool();
  const selectedLabels = getSelectedLabelIds();
  const lenSelectedLabels = selectedLabels.length;
  const selectedMaskLabel = getEditedMaskLabel();
  const maskExists = getMaskExists();

  const handleDeleteLabels = () => {
    deleteLabels(selectedLabels);
  };

  const handleBackToSelection = () => {
    setActiveTool(Tool.Selection);
  };

  const renderToolbarContent = () => {
    switch (currentTool) {
      case Tool.Mask:
        return <MaskToolbar />;
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
              {selectedMaskLabel && (
                <>
                  <div className="mx-2 h-6 w-[1px] bg-gray-300" />
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => setActiveTool(Tool.Mask)}
                    className="mr-1"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                </>
              )}
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
      {currentTool !== Tool.Selection && currentTool !== Tool.Pan && (
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
