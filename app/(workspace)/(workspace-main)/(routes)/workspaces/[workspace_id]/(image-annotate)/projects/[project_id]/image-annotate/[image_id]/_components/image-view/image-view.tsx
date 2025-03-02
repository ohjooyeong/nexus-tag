'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Stage as StageType } from 'konva/lib/Stage';
import { Image, Layer, Stage } from 'react-konva';
import Konva from 'konva';

import {
  MyRBush,
  retrieveImageDataWithFallback,
  retrieveObject,
} from '../../_helpers/image-view/data.helpers';

import { STAGE_INTERNAL_PADDING } from '../../_constants/constants';
import { Vector2d } from 'konva/lib/types';
import { getClampedPosition } from '../../_helpers/image-view/image-view.helpers';
import { ImageLabel } from '../../_types/image-label';
import { RequestParamsContextProvider } from '../../_provider/request-params-context-provider';
import { KonvaStageContextProvider } from '../../_provider/konva-stage-context-provider';
import { ImageClampingContextProvider } from '../../_provider/image-clamping-context-provider';
import Labels from '../../_labels/labels';

type ImageViewProps = {
  labels: ImageLabel[];
  projectId: string;
  imageId: string;
  imageObjectId: number | null;
  containerWidth: number;
  containerHeight: number;
};

const ImageView = ({
  labels,
  projectId,
  imageId,
  imageObjectId,
  containerWidth,
  containerHeight,
}: ImageViewProps) => {
  const imageData = retrieveImageDataWithFallback();
  const imageObject = retrieveObject(imageObjectId);

  const stageRef = useRef<StageType>(null);
  const groupRef = useRef<Konva.Group | null>(null);
  const imageRef = useRef<Konva.Image | null>(null);

  const width = containerWidth - 2 - 12;
  const height = containerHeight - 2 - 12;

  const viewportRatio = width / height;
  const imageRatio = imageData.width / imageData.height;
  const [imageWidth, imageHeight] =
    viewportRatio > imageRatio
      ? [imageData.width * (height / imageData.height), height]
      : [width, imageData.height * (width / imageData.width)];
  const getMinScale = useCallback(
    () =>
      viewportRatio > imageRatio
        ? (height - STAGE_INTERNAL_PADDING) / height
        : (width - STAGE_INTERNAL_PADDING) / width,
    [height, imageRatio, viewportRatio, width],
  );
  const minScaleRef = useRef(getMinScale());
  const currentScaleRef = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const scale = stage.scale()?.x;

    if (scale === undefined) return;
  }, []);

  useEffect(() => {
    minScaleRef.current = getMinScale();
  }, [getMinScale]);

  const [x, y] = useMemo(
    () => [
      (width - imageWidth + STAGE_INTERNAL_PADDING) / 2,
      (height - imageHeight + 12) / 2,
    ],
    [height, imageHeight, imageWidth, width],
  );
  const lastPosition = useRef<Vector2d>({ x, y });

  const setPosition = useCallback(
    (position: Vector2d, shouldClamp: boolean = true) => {
      const stage = stageRef.current;
      if (!stage) return;

      const newPosition = shouldClamp
        ? getClampedPosition(stage, position)
        : position;

      stage.position(newPosition);

      lastPosition.current = newPosition;
    },
    [stageRef],
  );

  const processedLabelsTree = useMemo(() => {
    stageRef.current?.getStage().batchDraw();
    const tree = new MyRBush();

    return tree;
  }, []);

  return (
    <div className="flex">
      <Stage
        className="flex flex-col relative overscroll-x-none touch-none p-[6px] bg-slate-300"
        ref={stageRef}
        width={width || 0}
        height={height || 0}
        x={x || 0}
        y={y || 0}
      >
        {stageRef.current ? (
          <RequestParamsContextProvider projectId={projectId} imageId={imageId}>
            <KonvaStageContextProvider stage={stageRef.current.getStage()}>
              <ImageClampingContextProvider>
                <Layer>
                  <Image
                    ref={imageRef}
                    image={imageObject}
                    width={imageWidth}
                    height={imageHeight}
                    strokeWidth={3}
                    stroke={'#7aa2f6'}
                    strokeScaleEnabled={false}
                    alt=""
                  />
                </Layer>
                <Labels
                  processedLabelsTree={processedLabelsTree}
                  groupRef={groupRef}
                />
              </ImageClampingContextProvider>
            </KonvaStageContextProvider>
          </RequestParamsContextProvider>
        ) : null}
      </Stage>
    </div>
  );
};

export default ImageView;
