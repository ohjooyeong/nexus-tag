import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import React, { useState } from 'react';
import { useToolStore } from '../../../_store/tool-store';
import { useMaskStore } from '../../../_store/mask-store';
import { useSelectedLabelsStore } from '../../../_store/label-collection/selected-labels-store';
import { Tool } from '../../../_types/types';
import { EraserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRUSH_SIZE_VALUES } from '../../../_constants/constants';

const MaskToolbar = () => {
  const { setActiveTool } = useToolStore();
  const {
    triggerAction,
    getMaskExists,
    toggleMode,
    getMode,
    getBrushSize,
    setBrushSize,
  } = useMaskStore();
  const { getEditedMaskLabel } = useSelectedLabelsStore();
  const selectedMaskLabel = getEditedMaskLabel();
  const maskExists = getMaskExists();
  const brushSize = getBrushSize();

  const handleBrushSizeChange = (value: number) => {
    const size = Math.min(Math.max(1, value), 100);
    setBrushSize(size);
  };

  return (
    <div className="text-gray-600 flex items-center gap-2">
      <Button
        variant={'ghost'}
        size="sm"
        onClick={() => setActiveTool(Tool.Selection)}
      >
        Discard
      </Button>

      <Button
        size="sm"
        onClick={() => triggerAction('convert')}
        disabled={!maskExists}
      >
        {selectedMaskLabel ? 'Update' : 'Convert'}
      </Button>
      <div className="mx-2 h-6 w-[1px] bg-gray-300" />
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={() => toggleMode()}
        className={cn('mr-1', getMode() === 'eraser' ? 'bg-blue-300' : '')}
      >
        <EraserIcon className="w-4 h-4" />
      </Button>
      <div className="flex items-center gap-2">
        <Slider
          value={[brushSize]}
          onValueChange={(values) => handleBrushSizeChange(values[0])}
          min={BRUSH_SIZE_VALUES.MIN}
          max={BRUSH_SIZE_VALUES.MAX}
          step={1}
          className="w-[100px]"
        />
        <Input
          type="number"
          value={brushSize}
          onChange={(e) => handleBrushSizeChange(Number(e.target.value))}
          className="w-[70px]"
          min={BRUSH_SIZE_VALUES.MIN}
          max={BRUSH_SIZE_VALUES.MAX}
        />
      </div>
    </div>
  );
};

export default MaskToolbar;
