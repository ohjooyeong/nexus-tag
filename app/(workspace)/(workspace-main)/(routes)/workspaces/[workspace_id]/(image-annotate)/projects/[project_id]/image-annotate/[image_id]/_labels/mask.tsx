import { KonvaEventObject } from 'konva/lib/Node';
import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { ImageLabel } from '../_types/image-label';
import Konva from 'konva';
import { getHeight, getWidth } from '../_utils/utils';
import {
  hexToRGB,
  processImageData,
  rleToImageData,
} from '../_helpers/mask/mask.helpers';
import { toast } from 'sonner';
import { useToolStore } from '../_store/tool-store';
import { Tool } from '../_types/types';
import { Group, Path } from 'react-konva';

type MaskLabelProps = {
  fill: string;
  stroke: string;
  strokeWidth?: number;
  dash?: number[];
  draggable: boolean;
  dragDistance: number;
  onMouseOut: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOver: (e: KonvaEventObject<MouseEvent>) => void;
  visible?: boolean;
  label: ImageLabel;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragStart?: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<MouseEvent>) => void;
  dragBoundFunc?: (pos: Konva.Vector2d) => Konva.Vector2d;
  absoluteScale: number;
  isDragged?: boolean;
};

const Mask = ({
  fill,
  stroke,
  strokeWidth,
  dash,
  label,
  absoluteScale,
  onClick,
  onDragStart,
  onDragEnd,
  onMouseOver,
  onMouseOut,
  draggable,
  dragDistance,
  dragBoundFunc,
  visible = true,
  isDragged,
}: MaskLabelProps) => {
  const pathRef = useRef(null);
  const [pathData, setPathData] = useState<string | null>(null);
  const { setActiveTool } = useToolStore();
  const { mask, bbox, borderData } = label;
  const x = bbox[0] * absoluteScale;
  const y = bbox[1] * absoluteScale;

  const width = getWidth(bbox);
  const height = getHeight(bbox);

  const scaledWidth = width * absoluteScale;
  const scaledHeight = height * absoluteScale;

  useLayoutEffect(() => {
    async function getImageData() {
      let imageData;
      let borderDataWorker = null;
      try {
        if (borderData || !mask || !width || !height) return;
        imageData = rleToImageData({
          mask,
          width,
          height,
          color: hexToRGB(fill, 255),
        });
        borderDataWorker = processImageData(imageData);
      } catch (error) {
        toast.error('Error processing mask');
      }
      setPathData(borderDataWorker);
    }
    getImageData();
  }, [borderData, mask, width, height]);

  const onDoubleClick = useCallback(
    (event: KonvaEventObject<MouseEvent>) => {
      onClick(event);
      setActiveTool(Tool.Mask);
    },
    [onClick, setActiveTool],
  );

  return borderData || pathData ? (
    <Group visible={visible}>
      <Path
        name="mask"
        isDragged={isDragged}
        draggable={draggable}
        dragDistance={dragDistance}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        dragBoundFunc={dragBoundFunc}
        onClick={onClick}
        onDblClick={onDoubleClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        id={label.id}
        ref={pathRef}
        data={borderData || pathData || ''}
        x={x}
        y={y}
        width={scaledWidth}
        height={scaledHeight}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        dash={dash}
        strokeScaleEnabled={false}
        scaleX={absoluteScale}
        scaleY={absoluteScale}
      />
    </Group>
  ) : null;
};

export default memo(Mask);
