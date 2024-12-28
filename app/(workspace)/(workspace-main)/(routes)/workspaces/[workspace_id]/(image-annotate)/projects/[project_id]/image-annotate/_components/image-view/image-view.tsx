'use client';

import { useRef } from 'react';
import { ImageLabel } from '../../_types/image-label';
import { Stage as StageType } from 'konva/lib/Stage';
import { Layer, Stage } from 'react-konva';
import Konva from 'konva';
import { RequestParamsContextProvider } from '../../_provider/request-params-context-provider';
import { KonvaStageContextProvider } from '../../_provider/konva-stage-context-provider';
import { ImageClampingContextProvider } from '../../_provider/image-clamping-context-provider';

type ImageViewProps = {
  labels: ImageLabel[];
  projectId: string;
  imageId: string;
  containerWidth: number;
  containerHeight: number;
};

const ImageView = ({
  labels,
  projectId,
  imageId,
  containerWidth,
  containerHeight,
}: ImageViewProps) => {
  const stageRef = useRef<StageType>(null);
  // const groupRef = useRef<Konva.Group | null>(null);
  // const imageRef = useRef<Konva.Image | null>(null);

  const width = containerWidth - 12;
  const height = containerHeight - 12;

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
                <Layer></Layer>
              </ImageClampingContextProvider>
            </KonvaStageContextProvider>
          </RequestParamsContextProvider>
        ) : null}
      </Stage>
    </div>
  );
};

export default ImageView;
