/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import Konva from 'konva';
import { Group, Layer } from 'react-konva';
import { useCanvasDimensions } from '../_provider/canvas-dimensions-context-provider';
import { ImageLabel } from '../_types/image-label';
import Label from './label';
import { MyRBush } from '../_helpers/image-view/data.helpers';

type LabelsProps = {
  processedLabelsTree: MyRBush;
  groupRef: React.RefObject<Konva.Group>;
};

const Labels = ({ processedLabelsTree, groupRef }: LabelsProps) => {
  const layerRef = useRef<any>(null);

  const { absoluteScale, imageHeight, imageWidth } = useCanvasDimensions();

  useLayoutEffect(() => {
    /* eslint-disable no-underscore-dangle */
    const nativeCtx = layerRef.current.getContext()._context;
    nativeCtx.webkitImageSmoothingEnabled = false;
    nativeCtx.mozImageSmoothingEnabled = false;
    nativeCtx.imageSmoothingEnabled = false;
  }, []);

  const processedLabels = useMemo<ImageLabel[]>(
    () =>
      processedLabelsTree
        .all()
        .filter((label) => label.classLabelId)
        .sort((a, b) => (a.zIndex > b.zIndex ? 1 : -1)),
    [processedLabelsTree],
  );

  return (
    <Layer ref={layerRef} visible={true} name="labelsLayer">
      <Group ref={groupRef} width={imageWidth} height={imageHeight}>
        {processedLabels.map((label) => (
          <Label key={label.id} label={label} />
        ))}
      </Group>
    </Layer>
  );
};

export default Labels;
