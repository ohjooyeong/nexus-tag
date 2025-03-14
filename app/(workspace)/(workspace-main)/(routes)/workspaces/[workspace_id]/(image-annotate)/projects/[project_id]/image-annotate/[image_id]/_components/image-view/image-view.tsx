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
import { Group, Image, Layer, Stage } from 'react-konva';
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
import { useZoomStore } from '../../_store/zoom-store';
import { usePanningStore } from '../../_store/panning-store';
import {
  CanvasDimensions,
  CanvasDimensionsContextProvider,
} from '../../_provider/canvas-dimensions-context-provider';
import { useToolStore } from '../../_store/tool-store';
import { Tool } from '../../_types/types';
import BboxTool from '../../_tools/bbox-tool/bbox-tool';
import {
  alwaysOnTopGroupName,
  alwaysOnTopLayerName,
} from '../always-on-top/always-on-top';
import { useSelectedLabelsStore } from '../../_store/label-collection/selected-labels-store';
import { MID_BLUE } from '../../_constants/colors';
import Panning from '../../_tools/panning/panning';
import Selection from '../../_tools/selection/selection';
import PolygonTool from '../../_tools/polygon-tool/polygon-tool';
import MaskTool from '../../_tools/mask-tool/mask-tool';

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
  const { getImageData, getObject, getImageId } = useImageStore();
  const { setZoom, getZoom } = useZoomStore();
  const { getActiveTool } = useToolStore();
  const { getEnabledPanning, setEnabledPanning } = usePanningStore();
  const { resetSelection } = useSelectedLabelsStore();
  const toolId = getActiveTool();
  const currentZoom = getZoom();
  const panningEnabled = getEnabledPanning();
  const imageId = getImageId();

  const imageData = useMemo(
    () => getImageData() || { width: 1, height: 1 },
    [getImageData()?.width, getImageData()?.height, getImageData],
  );

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
  }, [setZoom]);

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

  const handleMouseMove = useCallback(
    ({ evt }: Konva.KonvaEventObject<MouseEvent>) => {
      if (!panningEnabled) return;

      const stage = stageRef.current;
      if (!stage) return;

      const newPosition = {
        x: stage.x() + evt.movementX,
        y: stage.y() + evt.movementY,
      };

      stage.position(getClampedPosition(stage, newPosition, imageData));

      redrawStage(evt);
    },
    [panningEnabled, redrawStage, imageData],
  );

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

  const handleMiddleMouseButton = useCallback(
    ({ evt }: Konva.KonvaEventObject<MouseEvent>) => {
      // 마우스 가운데 휠 버튼
      if (evt.button === 1) {
        setEnabledPanning(true);
      }
    },
    [setEnabledPanning],
  );

  const handleMiddleMouseButtonUp = useCallback(
    ({ evt }: Konva.KonvaEventObject<MouseEvent>) => {
      if (evt.button === 1) {
        setEnabledPanning(false);
      }
    },
    [setEnabledPanning],
  );

  const handleMiddleMouseButtonLeave = useCallback(() => {
    if (panningEnabled) setEnabledPanning(false);
  }, [panningEnabled, setEnabledPanning]);

  const processedLabelsTree = useMemo(() => {
    stageRef.current?.getStage().batchDraw();
    const tree = new MyRBush();
    tree.load(labels);

    return tree;
  }, [labels]);

  const canvasDimensions = useMemo<CanvasDimensions>(
    () => ({
      originalImageWidth: imageData.width,
      originalImageHeight: imageData.height,
      imageWidth,
      imageHeight,
      absoluteScale,
      containerWidth: width,
      containerHeight: height,
    }),
    [
      absoluteScale,
      height,
      imageData.height,
      imageData.width,
      imageHeight,
      imageWidth,
      width,
    ],
  );

  return (
    <div className="flex">
      <Stage
        className="flex flex-col relative overscroll-x-none touch-none p-[6px] bg-slate-300"
        draggable={panningEnabled}
        ref={stageRef}
        width={width || 0}
        height={height || 0}
        x={x || 0}
        y={y || 0}
        onWheel={handleWheel}
        dragBoundFunc={handleDragBound}
        onMouseDown={handleMiddleMouseButton}
        onMouseUp={handleMiddleMouseButtonUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMiddleMouseButtonLeave}
      >
        {stageRef.current ? (
          <KonvaStageContextProvider stage={stageRef.current.getStage()}>
            <CanvasDimensionsContextProvider sizes={canvasDimensions}>
              <ImageClampingContextProvider>
                <Layer>
                  <Image
                    ref={imageRef}
                    image={imageObject}
                    width={imageWidth}
                    height={imageHeight}
                    onClick={() => {
                      resetSelection();
                    }}
                    strokeWidth={3}
                    stroke={MID_BLUE}
                    strokeScaleEnabled={false}
                    alt="image"
                  />
                </Layer>
                {toolId === Tool.Selection && (
                  <Selection
                    width={width}
                    height={height}
                    labels={labels}
                    processedLabelsTree={processedLabelsTree}
                  />
                )}
                {imageLoaded && (
                  <Labels
                    processedLabelsTree={processedLabelsTree}
                    groupRef={groupRef}
                  />
                )}
                {/* 라벨 선택 시 하얀 라인 위로 올리게 하는 레이어 */}
                <Layer name={alwaysOnTopLayerName}>
                  <Group name={alwaysOnTopGroupName} />
                </Layer>
                {toolId === Tool.Polygon && (
                  <PolygonTool width={width} height={height} />
                )}
                {toolId === Tool.Mask && (
                  <MaskTool
                    key={imageId}
                    width={imageWidth}
                    height={imageHeight}
                    labels={labels}
                  />
                )}
                {toolId === Tool.Bbox && (
                  <BboxTool width={width} height={height} />
                )}
                {panningEnabled && <Panning width={width} height={height} />}
              </ImageClampingContextProvider>
            </CanvasDimensionsContextProvider>
          </KonvaStageContextProvider>
        ) : null}
      </Stage>
    </div>
  );
};

export default ImageView;
