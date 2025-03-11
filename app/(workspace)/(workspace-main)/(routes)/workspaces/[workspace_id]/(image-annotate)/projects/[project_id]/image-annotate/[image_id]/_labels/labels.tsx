/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import Konva from 'konva';
import { Group, Layer } from 'react-konva';
import { useCanvasDimensions } from '../_provider/canvas-dimensions-context-provider';
import { ImageLabel } from '../_types/image-label';
import Label from './label';
import { MyRBush } from '../_helpers/image-view/data.helpers';
import { useClassLabelStore } from '../_store/class-label-store';
import { KonvaEventObject } from 'konva/lib/Node';
import { snapToPixel } from '../_helpers/image-view/common.helpers';
import { Bbox, Polygon } from '../_types/types';
import { useLabelsStore } from '../_store/label-collection/labels-store';

type LabelsProps = {
  processedLabelsTree: MyRBush;
  groupRef: React.RefObject<Konva.Group>;
};

const Labels = ({ processedLabelsTree, groupRef }: LabelsProps) => {
  const { absoluteScale, imageHeight, imageWidth } = useCanvasDimensions();

  const { classLabels, isClassLabelHidden } = useClassLabelStore();
  const { updateLabels, getLabelsMap } = useLabelsStore();

  const labelsMap = getLabelsMap();

  const layerRef = useRef<any>(null);
  const lastDragPositionStartRef = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    /* eslint-disable no-underscore-dangle */
    const nativeCtx = layerRef.current.getContext()._context;
    nativeCtx.webkitImageSmoothingEnabled = false;
    nativeCtx.mozImageSmoothingEnabled = false;
    nativeCtx.imageSmoothingEnabled = false;
  }, []);

  const handleDragStart = useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    e.evt.stopPropagation();
    if (e.evt instanceof MouseEvent && e.evt?.button !== 0) {
      e.target.stopDrag();

      return false;
    }

    lastDragPositionStartRef.current = e.target.position();
  }, []);

  const processedLabels = useMemo<ImageLabel[]>(
    () =>
      processedLabelsTree
        .all()
        .filter(
          (label) =>
            label.classLabelId && !isClassLabelHidden(label.classLabelId),
        )
        .sort((a, b) => (a.zIndex > b.zIndex ? 1 : -1)),
    [processedLabelsTree, isClassLabelHidden],
  );

  const handleDragEnd = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!e.evt) {
        return;
      }

      const { attrs } = e.target;
      const snappedX = snapToPixel(attrs.x, absoluteScale);
      const snappedY = snapToPixel(attrs.y, absoluteScale);
      const label = labelsMap[attrs.id];

      if (!label) {
        return;
      }

      e.target.position({
        x: snappedX,
        y: snappedY,
      });
      const bbox = [
        Math.round(snappedX / absoluteScale),
        Math.round(snappedY / absoluteScale),
        Math.round(
          snapToPixel(snappedX + attrs.width, absoluteScale) / absoluteScale,
        ),
        Math.round(
          snapToPixel(snappedY + attrs.height, absoluteScale) / absoluteScale,
        ),
      ] as Bbox;
      const getX = (x: number) =>
        Math.round(
          x + (snappedX - lastDragPositionStartRef.current.x) / absoluteScale,
        );
      const getY = (y: number) =>
        Math.round(
          y + (snappedY - lastDragPositionStartRef.current.y) / absoluteScale,
        );
      const data = [
        {
          id: attrs.id,
          changes: {
            bbox,
            polygon: label.polygon
              ? (label.polygon.map(([x, y]) => [getX(x), getY(y)]) as Polygon)
              : label.polygon,
          },
        },
      ];
      updateLabels(data, 'move');
    },

    [absoluteScale, updateLabels, labelsMap],
  );

  return (
    <Layer ref={layerRef} visible={true} name="labelsLayer">
      <Group ref={groupRef} width={imageWidth} height={imageHeight}>
        {processedLabels.map((label) => (
          <Label
            key={label.id}
            label={label}
            labelClass={
              label.classLabelId ? classLabels[label.classLabelId] : null
            }
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Group>
    </Layer>
  );
};

export default Labels;
