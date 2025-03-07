'use client';

import { Layer, Rect } from 'react-konva';
import { useCanvasDimensions } from '../../_provider/canvas-dimensions-context-provider';
import { act, useCallback, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { useKonvaStage } from '../../_provider/konva-stage-context-provider';
import { usePanningStore } from '../../_store/panning-store';
import { useImageClamping } from '../../_provider/image-clamping-context-provider';
import { getStagePointerCoordinatesSnappedToPixel } from '../../_helpers/image-view/common.helpers';
import { Bbox } from '../../_types/types';
import { useLabelsStore } from '../../_store/labels-store';
import { v4 as uuidv4 } from 'uuid';
import { useClassLabelStore } from '../../_store/class-label-store';
import { KonvaEventObject } from 'konva/lib/Node';
import { BBOX_FILL_COLOR, BBOX_STROKE_COLOR } from '../../_constants/constants';

type BboxToolProps = {
  width: number;
  height: number;
};

const BboxTool = ({ width, height }: BboxToolProps) => {
  const { absoluteScale } = useCanvasDimensions();
  const stage = useKonvaStage();
  const { getEnabledPanning } = usePanningStore();
  const { addLabels } = useLabelsStore();
  const { getActiveClassLabelId } = useClassLabelStore();
  const activeClassLabelId = getActiveClassLabelId();
  const panningEnabled = getEnabledPanning();
  const { getClosestPositionInImageBounds } = useImageClamping();
  const bboxRef = useRef<Konva.Rect | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const hasStartingPointRef = useRef(false);

  const [bboxInitialCoordinates, setBboxInitialCoordinates] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  const processPoint = useCallback(
    (isMouseUp?: boolean) => {
      const coords = getStagePointerCoordinatesSnappedToPixel(
        stage,
        absoluteScale,
        getClosestPositionInImageBounds(),
      );
      if (coords) {
        if (bboxInitialCoordinates && hasStartingPointRef.current) {
          const { x, y } = coords;
          const x1 = Math.round(bboxInitialCoordinates.x);
          const y1 = Math.round(bboxInitialCoordinates.y);
          const x2 = Math.round(x / absoluteScale);
          const y2 = Math.round(y / absoluteScale);
          const bbox = [
            Math.min(x1, x2),
            Math.min(y1, y2),
            Math.max(x1, x2),
            Math.max(y1, y2),
          ] as Bbox;

          if (bbox[0] === bbox[2] || bbox[1] === bbox[3]) {
            return;
          }

          addLabels([
            {
              id: uuidv4(),
              bbox,
              classLabelId: activeClassLabelId ?? undefined,
            },
          ]);
          setBboxInitialCoordinates(undefined);
          hasStartingPointRef.current = false;
        } else if (!isMouseUp) {
          hasStartingPointRef.current = true;
          setBboxInitialCoordinates({
            x: coords.x / absoluteScale,
            y: coords.y / absoluteScale,
          });
        }
      }
    },
    [
      absoluteScale,
      activeClassLabelId,
      bboxInitialCoordinates,
      addLabels,
      getClosestPositionInImageBounds,
      stage,
    ],
  );

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (e.evt.type === 'mousedown' && (e.evt as MouseEvent).button !== 0) {
        return;
      }
      e.cancelBubble = true;

      processPoint();
    },
    [processPoint],
  );

  const handleMouseMove = useCallback(
    (e: { cancelBubble: boolean }) => {
      e.cancelBubble = true;
      const coords = getStagePointerCoordinatesSnappedToPixel(
        stage,
        absoluteScale,
        getClosestPositionInImageBounds(),
      );
      if (bboxInitialCoordinates && coords) {
        const bbox = bboxRef.current;
        bbox?.setAttrs({
          x:
            Math.min(bboxInitialCoordinates.x, coords.x / absoluteScale) *
            absoluteScale,
          y:
            Math.min(bboxInitialCoordinates.y, coords.y / absoluteScale) *
            absoluteScale,
          width:
            Math.abs(coords.x / absoluteScale - bboxInitialCoordinates.x) *
            absoluteScale,
          height:
            Math.abs(coords.y / absoluteScale - bboxInitialCoordinates.y) *
            absoluteScale,
        });
        stage.batchDraw();
      }
    },
    [
      absoluteScale,
      bboxInitialCoordinates,
      getClosestPositionInImageBounds,
      stage,
    ],
  );

  useEffect(() => {
    handleMouseMove({ cancelBubble: true });
  }, [absoluteScale, handleMouseMove]);

  const handleMouseUp = useCallback(
    (e: KonvaEventObject<MouseEvent> | MouseEvent) => {
      e.cancelBubble = true;

      processPoint(true);
    },
    [processPoint],
  );

  useEffect(() => {
    if (!panningEnabled) {
      stage.on('mousemove.bbox', (e) => {
        handleMouseMove(e);
      });
      stage.on('mousedown.bbox', (e) => {
        handleMouseDown(e);
      });
      stage.on('mouseup.bbox', (e) => {
        handleMouseUp(e);
      });
    }

    return () => {
      stage.off('mousemove.bbox mousedown.bbox mouseup.bbox');
      stage.container().removeEventListener('mouseout', handleMouseUp);
    };
  }, [
    getClosestPositionInImageBounds,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    stage,
    panningEnabled,
  ]);

  return (
    <Layer ref={layerRef}>
      <Rect width={width} height={height} />
      {bboxInitialCoordinates && (
        <Rect
          ref={bboxRef}
          listening={false}
          strokeScaleEnabled={false}
          fill={`${BBOX_FILL_COLOR}33`}
          stroke={BBOX_STROKE_COLOR}
          strokeWidth={2}
          dash={[10, 10]}
        />
      )}
    </Layer>
  );
};

export default BboxTool;
