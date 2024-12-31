'use client';

import { useMemo, useRef } from 'react';
import { ImageLabel } from '../../_types/image-label';
import { Stage as StageType } from 'konva/lib/Stage';
import { Image, Layer, Stage } from 'react-konva';
import Konva from 'konva';
import { RequestParamsContextProvider } from '../../_provider/request-params-context-provider';
import { KonvaStageContextProvider } from '../../_provider/konva-stage-context-provider';
import { ImageClampingContextProvider } from '../../_provider/image-clamping-context-provider';
import {
  MyRBush,
  retrieveImageDataWithFallback,
  retrieveObject,
} from '../../_helpers/image-view/data.helpers';
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

  const width = containerWidth - 12;
  const height = containerHeight - 12;

  const viewportRatio = width / height;
  const imageRatio = imageData.width / imageData.height;
  const [imageWidth, imageHeight] =
    viewportRatio > imageRatio
      ? [imageData.width * (height / imageData.height), height]
      : [width, imageData.height * (width / imageData.width)];

  const processedLabelsTree = useMemo(() => {
    stageRef.current?.getStage().batchDraw();
    const tree = new MyRBush();

    return tree;
  }, []);

  return (
    <div className="h-full flex flex-grow flex-shrink flex-col touch-none overscroll-x-none">
      <Stage
        className="p-[6px] bg-slate-300"
        ref={stageRef}
        width={width}
        height={height}
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
