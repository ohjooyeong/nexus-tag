'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import debounce from 'lodash/debounce';
import { Stage as StageType } from 'konva/lib/Stage';
import { Image, Layer, Stage } from 'react-konva';
import Konva from 'konva';

import { MyRBush } from '../../_helpers/image-view/data.helpers';

import {
  STAGE_INTERNAL_PADDING,
  ZOOM_IN_MAX_VALUE,
  ZOOM_SPEED,
} from '../../_constants/constants';
import { Vector2d } from 'konva/lib/types';
import { getClampedPosition } from '../../_helpers/image-view/image-view.helpers';
import { ImageLabel } from '../../_types/image-label';

import { KonvaStageContextProvider } from '../../_provider/konva-stage-context-provider';
import { ImageClampingContextProvider } from '../../_provider/image-clamping-context-provider';
import Labels from '../../_labels/labels';
import { useImageStore } from '../../_store/image-store';
import { useEditorStore } from '../../_store/editor-store';

type ImageViewProps = {
  labels: ImageLabel[];

  imageObjectId: number | null;
  containerWidth: number;
  containerHeight: number;
};

const ImageView = ({
  labels,
  imageObjectId,
  containerWidth,
  containerHeight,
}: ImageViewProps) => {
  const { getImageData, getObject } = useImageStore();
  const { setZoom, getZoom } = useEditorStore();
  const currentZoom = getZoom();

  const imageData = getImageData() || { width: 1, height: 1 };

  const imageObject = imageObjectId !== null ? getObject(imageObjectId) : null;

  const imageLoaded = imageObject !== null;

  const stageRef = useRef<StageType>(null);
  const groupRef = useRef<Konva.Group | null>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const timeoutRef = useRef<number>();

  const width = containerWidth - 2 - 12;
  const height = containerHeight - 2 - 12;
  const absoluteScale = Math.min(
    width / imageData.width,
    height / imageData.height,
  );

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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const scale = stage.scale()?.x;

    if (scale === undefined) return;

    setZoom(scale);
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

  const triggerStage = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Transformer라는 핸들러가 적절한 크기를 가지도록 다시 그리는 함수
    // 스테이지는 scale 값이 변경되어도 바로 적용되지만, transformer는 scale 값이 변경되지 않으면 그대로 유지됨
    stage.find<Konva.Transformer>('Transformer').forEach((transformer) => {
      transformer.forceUpdate(); // 수동 업데이트
    });
    stage.batchDraw(); // 캔버스 다시 그리기
  }, [stageRef]);

  const setPosition = useCallback(
    (position: Vector2d, shouldClamp: boolean = true) => {
      const stage = stageRef.current;
      if (!stage) return;

      const newPosition = shouldClamp
        ? getClampedPosition(stage, position, imageData)
        : position;

      stage.position(newPosition);

      lastPosition.current = newPosition;
    },
    [stageRef, imageData],
  );

  // useCallback을 사용하니까 useCallback 부분에서 warning이 떠서 useMemo로 진행.
  const updateZoom = useMemo(
    () => debounce((newZoom: number) => setZoom(newZoom), 500),
    [setZoom],
  );

  const redrawStage = useCallback(
    (evt?: WheelEvent | MouseEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        requestAnimationFrame(() => {
          stage.draw();
        });
      }, 300);

      triggerStage();

      if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }
    },
    [triggerStage],
  );

  const redrawStageOnZoom = useCallback(
    (position?: { x: number; y: number }) => {
      const { x, y } = position || lastPosition.current;
      setPosition({ x, y });
      redrawStage();
    },
    [redrawStage, setPosition],
  );

  const saveViewportSizes = useCallback(() => {
    redrawStageOnZoom();
    if (!imageRef.current) return;
    // eslint-disable-next-line no-underscore-dangle
    imageRef.current.getContext()._context.imageSmoothingEnabled = false;
  }, [redrawStageOnZoom]);

  useEffect(() => {
    saveViewportSizes();
  }, [saveViewportSizes]);

  const handleDragBound = useCallback(
    (position: { x: number; y: number }) => {
      const stage = stageRef.current;
      if (!stage) return { x: 0, y: 0 };

      const scale = stage.scale()?.x;

      if (scale === minScaleRef.current) {
        return {
          x,
          y,
        };
      }

      return getClampedPosition(stage, position, imageData);
    },
    [x, y, imageData],
  );

  const zoom = useCallback(
    (zoomIn: boolean) => {
      const stage = stageRef.current;
      if (!stage) return;

      const scale = stage.scale()?.x;

      if (scale === undefined) return;

      let newScale = scale * (zoomIn ? 1 + ZOOM_SPEED : 1 - ZOOM_SPEED);

      if (currentZoom * absoluteScale > ZOOM_IN_MAX_VALUE) return;

      if (newScale * absoluteScale >= ZOOM_IN_MAX_VALUE)
        newScale = ZOOM_IN_MAX_VALUE / absoluteScale;

      if (newScale < minScaleRef.current) {
        newScale = minScaleRef.current;
        setPosition({ x, y }, false);
      } else {
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = {
          x: (pointer.x - stage.x()) / scale,
          y: (pointer.y - stage.y()) / scale,
        };
        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        setPosition(newPos, false);
      }

      stage.scale({
        x: newScale,
        y: newScale,
      });
      updateZoom(newScale);
    },
    [currentZoom, absoluteScale, x, y, updateZoom, setPosition],
  );

  // 이미지 초기화시 이미지 픽셀화
  // 마스크 브러시 기능시 픽셀 칠할 때 UX적으로 편함.
  useLayoutEffect(() => {
    if (!imageRef.current) return;

    // eslint-disable-next-line no-underscore-dangle
    imageRef.current.getContext()._context.imageSmoothingEnabled = false; // 이미지 픽셀화
    const stage = stageRef.current;
    if (!stage) return;

    stage.scale({ x: minScaleRef.current, y: minScaleRef.current });
    stage.position(lastPosition.current);
    stage.batchDraw();
  }, [imageLoaded]);

  // 이미지가 로드된 후 초기 스케일과 위치를 설정
  useLayoutEffect(() => {
    if (!imageLoaded) return;

    const stage = stageRef.current;
    if (!stage) return;

    stage.scale({ x: minScaleRef.current, y: minScaleRef.current });
    updateZoom(minScaleRef.current);
    setPosition(lastPosition.current);

    redrawStageOnZoom();
  }, [imageLoaded, redrawStageOnZoom, setPosition, updateZoom]);

  const handleWheel = useCallback(
    ({ evt }: Konva.KonvaEventObject<WheelEvent>) => {
      if (!imageLoaded) return;
      const stage = stageRef.current;
      if (!stage) return;

      evt.preventDefault();

      zoom(evt.deltaY < 0);
      redrawStage(evt);

      // TO DO: 터치 이벤트도 다음에 추가할 예정(트랙 패드 기능)
    },
    [imageLoaded, redrawStage, zoom],
  );

  const processedLabelsTree = useMemo(() => {
    stageRef.current?.getStage().batchDraw();
    const tree = new MyRBush();
    // TO DO: 라벨에 대한 트리구조를 만들어서 반환하도록 추가해야함

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
        onWheel={handleWheel}
        dragBoundFunc={handleDragBound}
      >
        {stageRef.current ? (
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
        ) : null}
      </Stage>
    </div>
  );
};

export default ImageView;
