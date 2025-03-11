import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Group, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Box as TransformerBox } from 'konva/lib/shapes/Transformer';
import { ImageLabel } from '../_types/image-label';
import { useKonvaStage } from '../_provider/konva-stage-context-provider';
import { useCanvasDimensions } from '../_provider/canvas-dimensions-context-provider';
import { useLabelsStore } from '../_store/label-collection/labels-store';
import CursorCrosshair from '../_components/cursor/cursor-crosshair';

type BoxProps = {
  absoluteScale: number;
  label: ImageLabel;
  draggable: boolean;
  dragDistance: number;
  resizable: boolean;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragStart?: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOut: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOver: (e: KonvaEventObject<MouseEvent>) => void;
  dragBoundFunc?: (pos: Konva.Vector2d) => Konva.Vector2d;
  fill: string;
  stroke: string;
  dash?: number[];
  strokeWidth?: number;
  isDragged?: boolean;
};

const Box = ({
  absoluteScale,
  label,
  onClick,
  draggable,
  dragDistance,
  resizable,
  onDragStart,
  onDragEnd,
  onMouseOut,
  onMouseOver,
  dragBoundFunc,
  fill,
  stroke,
  dash,
  isDragged,
  strokeWidth = 1,
}: BoxProps) => {
  const { updateLabels } = useLabelsStore();

  const bboxRef = useRef<Konva.Rect | null>(null);
  const transformRef = useRef<Konva.Transformer | null>(null);
  const x = label.bbox[0] * absoluteScale;
  const y = label.bbox[1] * absoluteScale;
  const width = (label.bbox[2] - label.bbox[0]) * absoluteScale;
  const height = (label.bbox[3] - label.bbox[1]) * absoluteScale;

  useEffect(() => {
    if (resizable && bboxRef.current && transformRef.current) {
      transformRef.current.attachTo(bboxRef.current);

      transformRef.current.getLayer()?.batchDraw();
    } else {
      transformRef.current?.detach();
    }
  }, [resizable, x, y, width, height]);

  const [isTransformation, setIsTransformation] = useState(false);
  const handleTransformStart = useCallback(() => {
    setIsTransformation(true);
  }, []);

  const stage = useKonvaStage();

  const handleTransform = useCallback(
    (e: KonvaEventObject<MouseEvent>) => stage.fire('mousemove', e),
    [stage],
  );

  const handleTransformEnd = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const { attrs } = e.target;
      setIsTransformation(false);
      if (!attrs.scaleX || !attrs.scaleY) return;
      const snappedWidth = Math.round(
        (attrs.width / absoluteScale) * attrs.scaleX,
      );
      const snappedHeight = Math.round(
        (attrs.height / absoluteScale) * attrs.scaleY,
      );
      const x1 = Math.round(attrs.x / absoluteScale);
      const y1 = Math.round(attrs.y / absoluteScale);
      const x2 = x1 + snappedWidth;
      const y2 = y1 + snappedHeight;
      const bbox = [
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.max(x1, x2),
        Math.max(y1, y2),
      ] as [number, number, number, number];
      const data = [
        {
          id: attrs.id,
          changes: { bbox },
        },
      ];
      updateLabels(data, 'resize');

      e.target.setAttrs({
        scaleX: 1,
        scaleY: 1,
        x: bbox[0] * absoluteScale,
        y: bbox[1] * absoluteScale,
        width: (bbox[2] - bbox[0]) * absoluteScale,
        height: (bbox[3] - bbox[1]) * absoluteScale,
      });
    },
    [absoluteScale, updateLabels],
  );

  const { imageWidth, imageHeight } = useCanvasDimensions();

  const handleBoundBoxFunc = useCallback(
    (oldBox: TransformerBox, newBox: TransformerBox) => {
      if (
        newBox.x < stage.x() ||
        newBox.y < stage.y() ||
        newBox.width < 1 ||
        newBox.height < 1
      ) {
        return oldBox;
      }

      const snappedX = Math.round(newBox.x / absoluteScale) * absoluteScale;
      const snappedY = Math.round(newBox.y / absoluteScale) * absoluteScale;
      const snappedWidth =
        Math.round(newBox.width / absoluteScale) * absoluteScale;
      const snappedHeight =
        Math.round(newBox.height / absoluteScale) * absoluteScale;

      if (
        snappedWidth + snappedX > imageWidth * stage.scaleX() + stage.x() ||
        snappedHeight + snappedY > imageHeight * stage.scaleY() + stage.y()
      ) {
        return oldBox;
      }

      return {
        x: snappedX,
        y: snappedY,
        width: snappedWidth || absoluteScale,
        height: snappedHeight || absoluteScale,
        rotation: 0,
      };
    },
    [absoluteScale, imageHeight, imageWidth, stage],
  );

  return (
    <Group>
      <Rect
        id={label.id}
        x={x}
        y={y}
        width={width}
        height={height}
        onClick={onClick}
        draggable={draggable}
        dragDistance={dragDistance}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        dragBoundFunc={dragBoundFunc}
        onTransformStart={handleTransformStart}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
        strokeScaleEnabled={false}
        stroke={stroke}
        dash={dash}
        isDragged={isDragged}
        fill={fill}
        name="bbox"
        ref={bboxRef}
        strokeWidth={strokeWidth}
      />
      {resizable && (
        <>
          <Transformer
            ref={transformRef}
            rotateEnabled={false}
            keepRatio={false}
            boundBoxFunc={handleBoundBoxFunc}
            flipEnabled={false}
            ignoreStroke
          />
          {isTransformation && <CursorCrosshair />}
        </>
      )}
    </Group>
  );
};

export default Box;
