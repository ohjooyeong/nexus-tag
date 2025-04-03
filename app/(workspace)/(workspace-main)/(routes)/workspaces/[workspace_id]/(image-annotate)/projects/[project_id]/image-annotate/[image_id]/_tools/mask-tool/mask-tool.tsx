import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCanvasDimensions } from '../../_provider/canvas-dimensions-context-provider';
import { useKonvaStage } from '../../_provider/konva-stage-context-provider';
import { ImageLabel, LabelType } from '../../_types/image-label';
import Konva from 'konva';
import { CombinedLabel, Polygon, ProcessedImageData } from '../../_types/types';
import { useClassLabelStore } from '../../_store/class-label-store';
import { usePanningStore } from '../../_store/panning-store';
import { useSelectedLabelsStore } from '../../_store/label-collection/selected-labels-store';
import { useMaskStore } from '../../_store/mask-store';
import {
  useLabelsHistory,
  useLabelsStore,
} from '../../_store/label-collection/labels-store';
import {
  BRUSH_SIZE_VALUES,
  POTENTIAL_LABEL_FILL_COLOR_WITH_OPACITY,
  UNDO_REDO_STACK_LIMIT,
} from '../../_constants/constants';
import chroma from 'chroma-js';
import { getColors } from '../../_labels/style';
import {
  convertPolygonToSVGPath,
  excludeShapes,
  renderStrokes,
} from '../../_utils/utils';
import {
  getClosedMask,
  getImageDataFromLabel,
  getMaskToSave,
  maskToImageData,
  transformImageDataOpacity,
} from './actions';
import {
  drawingOffScreen,
  processImageData,
} from '../../_helpers/mask/mask.helpers';
import { Vector2d } from 'konva/lib/types';
import { BLACK, ERASER_STROKE, SLATE_GREY } from '../../_constants/colors';
import svgpath from 'svgpath';
import { v4 as uuidv4 } from 'uuid';
import { useToolStore } from '../../_store/tool-store';
import { getStagePointerCoordinates } from '../../_helpers/image-view/common.helpers';
import { toast } from 'sonner';
import { Circle, Image, Layer, Path, Rect } from 'react-konva';
import CursorSetter from '../../_components/cursor/cursor-setter';
import { StageScaleProvider } from '../../_provider/stage-scale-provider';
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook';
import { useMaskToolShortcuts } from './use-mask-tool-shortcuts';

type MaskToolProps = {
  width: number;
  height: number;
  labels: ImageLabel[];
};

const offscreenCanvasSupported = typeof OffscreenCanvas !== 'undefined';

const MaskTool = ({ width, height, labels }: MaskToolProps) => {
  const stage = useKonvaStage();
  const { absoluteScale } = useCanvasDimensions();
  const { getActiveClassLabelId, classLabels } = useClassLabelStore();
  const { getEnabledPanning } = usePanningStore();
  const { getEditedMaskLabel } = useSelectedLabelsStore();
  const {
    setBrushSize,
    getBrushSize,
    getOverpainting,
    getMode,
    getActionTrigger,
    getMaskExists,
    setMaskExists,
    triggerAction,
    toggleOverpainting,
    setBrush,
    setEraser,
  } = useMaskStore();
  const { resetActiveTool } = useToolStore();
  const { undo, redo, futureStates, pastStates } = useLabelsHistory(
    (state) => state,
  );
  const canUndo = () => pastStates.length > 0;
  const canRedo = () => futureStates.length > 0;

  const { updateLabels, deleteLabels, addLabels } = useLabelsStore();

  const maskExists = getMaskExists();
  const activeClassLabelId = getActiveClassLabelId();

  const panningEnabled = getEnabledPanning();
  const editedLabel = getEditedMaskLabel();
  const labelClass = classLabels[editedLabel?.classLabelId || ''];
  const brushSize = getBrushSize();
  const overpainting = getOverpainting();
  const mode = getMode();
  const actionTrigger = getActionTrigger();
  const minUndoIndex = editedLabel ? 1 : 0;

  const imageWidth = useMemo(
    () => width / absoluteScale,
    [absoluteScale, width],
  );
  const imageHeight = useMemo(
    () => height / absoluteScale,
    [absoluteScale, height],
  );

  /**
   * 빈 캔버스 생성 함수
   * OffscreenCanvas가 지원되면 사용하고, 아니면 일반 캔버스 생성
   */
  const createEmptyCanvas = useCallback(() => {
    let canvasElement;
    if (offscreenCanvasSupported) {
      canvasElement = new OffscreenCanvas(imageWidth, imageHeight);
    } else {
      canvasElement = document.createElement('canvas');
      canvasElement.width = imageWidth;
      canvasElement.height = imageHeight;
    }
    const context = canvasElement.getContext('2d') as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D;

    if (context) {
      context.imageSmoothingEnabled = false;
    }

    return canvasElement;
  }, [imageHeight, imageWidth]);

  const layerRef = useRef<Konva.Layer>(null);
  const cursorLayerRef = useRef<Konva.Layer>(null);
  const drawingRef = useRef<Konva.Rect>(null);
  const circleRef = useRef<Konva.Circle>(null);
  const lastPointerPosition = useRef<Partial<Polygon[0]>>([]);

  const canvasRef = useRef(useMemo(createEmptyCanvas, [createEmptyCanvas]));
  const hoverCanvasRef = useRef(
    useMemo(createEmptyCanvas, [createEmptyCanvas]),
  );
  const onScreenCanvasRef = useRef(
    useMemo(createEmptyCanvas, [createEmptyCanvas]),
  );

  const undoRedoIndex = useRef(0);
  const paintRef = useRef(false);
  const borderRef = useRef<Konva.Path>(null);
  const mouseMovementRef = useRef<{
    globalCompositeOperation: GlobalCompositeOperation;
    hex: string;
    lineWidth: number;
    points: [number, number][];
  } | null>(null);
  const undoRedoStackRef = useRef<
    { imageData: ImageData | null; borders: string | null }[]
  >([{ imageData: null, borders: null }]);

  const [isPainting, setIsPainting] = useState(false);
  const [combinedLabels, setCombinedLabels] = useState<CombinedLabel[]>([]);
  const [combinedLabelsIds, setCombinedLabelsIds] = useState<string[]>([]);
  const [canvasBusy, setCanvasBusy] = useState(false);
  const [borderData, setBorderData] = useState<string | null>(null);
  const isBrush = useMemo(() => mode === 'brush', [mode]);

  const strokeColor = useMemo(() => {
    const maskBrushColor = (
      editedLabel?.classLabelId
        ? labelClass?.color
        : POTENTIAL_LABEL_FILL_COLOR_WITH_OPACITY
    ) as string;
    const rgba = chroma(maskBrushColor).rgba();

    return {
      rgba,
      opacity: rgba[3],
      hex: chroma.rgb(rgba[0], rgba[1], rgba[2]).alpha(1).hex(),
    };
  }, [editedLabel, labelClass]);

  const brushCursorRadius = useMemo(() => brushSize / 2 + 0.5, [brushSize]);
  const borderAnimation = useMemo(
    () =>
      new Konva.Animation((frame) => {
        if (borderRef.current && frame) {
          borderRef.current.dashOffset(250 * Math.sin(frame.time / 10000));
          cursorLayerRef?.current?.batchDraw();
        }
      }),
    [],
  );

  const { fill } = useMemo(
    () =>
      getColors({
        selected: true,
        hovered: true,
        color: labelClass?.color,
        isFilled: false,
      }),
    [labelClass?.color],
  );

  const clearStack = useCallback(() => {
    undoRedoStackRef.current = [{ imageData: null, borders: null }];
    undoRedoIndex.current = 0;
    setBorderData(null);
  }, []);

  const undoStack = useCallback(() => {
    if (undoRedoIndex.current > minUndoIndex) {
      undoRedoIndex.current--;
    }
  }, [minUndoIndex]);

  const redoStack = useCallback(() => {
    undoRedoIndex.current =
      undoRedoIndex.current < undoRedoStackRef.current.length - 1
        ? undoRedoIndex.current + 1
        : undoRedoIndex.current;
  }, []);

  const getCurrentStackValue = useCallback(
    () => undoRedoStackRef.current[undoRedoIndex.current],
    [],
  );

  const calculateBorderData = useCallback(() => {
    const { borders } = getCurrentStackValue();

    setBorderData(borders);
  }, [getCurrentStackValue]);

  const restoreRenderedState = useCallback(
    (context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => {
      const { borders } = getCurrentStackValue();

      if (borders) {
        const shape = new Path2D(borders);

        context.save();
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = strokeColor.hex;
        context.fill(shape);
      }
    },
    [getCurrentStackValue, strokeColor.hex],
  );

  const getCurrentImageDataForNonOffscreen = useCallback(async () => {
    const paintBelowLayers = isBrush && !overpainting;

    const context = onScreenCanvasRef.current.getContext(
      '2d',
    ) as CanvasRenderingContext2D;
    const mouseMovementData = mouseMovementRef.current;
    const { imageData } = getCurrentStackValue();

    if (context) {
      if (imageData && !paintBelowLayers) {
        context.putImageData(imageData, 0, 0);
      }
      if (mouseMovementData) {
        const { points, hex, lineWidth, globalCompositeOperation } =
          mouseMovementData;

        context.globalCompositeOperation =
          globalCompositeOperation as GlobalCompositeOperation;
        context.strokeStyle = hex;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        let lastPosition = points[0];

        points.forEach(([x, y]) => {
          const [lastX = x, lastY = y] = lastPosition;
          renderStrokes({
            context,
            brushSize,
            x,
            y,
            lastX,
            lastY,
          });
          lastPosition = [x, y];
        });
      }

      if (paintBelowLayers && combinedLabels.length) {
        excludeShapes({
          context,
          combinedLabels,
          shouldIntersect: false,
        });

        restoreRenderedState(context);
      }

      const resultImageData = context.getImageData(
        0,
        0,
        onScreenCanvasRef.current.width,
        onScreenCanvasRef.current.height,
      );
      transformImageDataOpacity(resultImageData);

      return {
        imageData: resultImageData,
        borders: processImageData(resultImageData),
      };
    }
  }, [
    brushSize,
    combinedLabels,
    getCurrentStackValue,
    isBrush,
    overpainting,
    restoreRenderedState,
  ]);

  /**
   * 현재 이미지 데이터 가져오기 함수
   * OffscreenCanvas 지원 여부에 따라 다른 처리 방식 사용
   */
  const getCurrentImageData = useCallback(async () => {
    const paintBelowLayers = isBrush && !overpainting;
    let result;

    if (offscreenCanvasSupported) {
      try {
        result = await drawingOffScreen({
          currentValue: getCurrentStackValue(),
          width: canvasRef.current.width,
          height: canvasRef.current.height,
          mouseMovement: mouseMovementRef.current,
          excludedAreas:
            paintBelowLayers && combinedLabels.length ? combinedLabels : null,
        });
      } catch (error) {
        result = await getCurrentImageDataForNonOffscreen();
      }
    } else {
      result = await getCurrentImageDataForNonOffscreen();
    }

    return result
      ? { imageData: result.imageData, borders: result.borders }
      : null;
  }, [
    combinedLabels,
    getCurrentImageDataForNonOffscreen,
    getCurrentStackValue,
    isBrush,
    overpainting,
  ]);

  /**
   * 실행 취소/다시 실행 스택 관리 함수
   * 마스크 편집 기록을 저장하고 복원하는 역할
   */
  const pushToStack = useCallback(
    (stackItem: { imageData: ImageData; borders: string | null }) => {
      const { imageData } = stackItem;
      if (!imageData) {
        return;
      }
      undoRedoStackRef.current = undoRedoStackRef.current.slice(
        0,
        undoRedoIndex.current + 1,
      );
      undoRedoStackRef.current.push(stackItem);
      undoRedoStackRef.current = undoRedoStackRef.current.slice(
        Math.max(undoRedoStackRef.current.length - UNDO_REDO_STACK_LIMIT, 0),
      );
      undoRedoIndex.current = undoRedoStackRef.current.length - 1;
      calculateBorderData();
    },
    [calculateBorderData],
  );

  const handleDecreaseBrushSize = useCallback(() => {
    const newSize = brushSize - 1;
    if (newSize >= BRUSH_SIZE_VALUES.MIN) {
      setBrushSize(newSize);
    }
  }, [brushSize, setBrushSize]);

  const handleIncreaseBrushSize = useCallback(() => {
    const newSize = brushSize + 1;
    if (newSize <= BRUSH_SIZE_VALUES.MAX) {
      setBrushSize(newSize);
    }
  }, [brushSize, setBrushSize]);

  /**
   * 오버페인팅 영역 그리기 함수
   * 다른 레이블과의 겹침 처리를 담당
   */
  const drawOverpaintingArea = useCallback(
    ({
      context,
      shouldIntersect = true,
      shouldRestore = true,
    }: {
      context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
      shouldIntersect?: boolean;
      shouldRestore?: boolean;
    }) => {
      const paintBelowLayers = isBrush && !overpainting;

      if (paintBelowLayers && circleRef.current && combinedLabels.length) {
        const cursorBox = circleRef.current?.getClientRect({
          relativeTo: cursorLayerRef.current || undefined,
        });
        excludeShapes({
          context,
          combinedLabels,
          cursorBox,
          shouldIntersect,
        });

        if (shouldRestore) restoreRenderedState(context);
      }
    },
    [combinedLabels, isBrush, overpainting, restoreRenderedState],
  );

  const drawHovered = useCallback(
    (point: Vector2d) => {
      const [x, y] = [
        Math.floor(point.x / absoluteScale),
        Math.floor(point.y / absoluteScale),
      ];

      const canvas = hoverCanvasRef.current;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;

      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      layerRef?.current?.batchDraw();
      cursorLayerRef?.current?.batchDraw();

      if (panningEnabled) {
        return;
      }

      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = mode === 'eraser' ? ERASER_STROKE : strokeColor.hex;

      renderStrokes({
        context,
        brushSize,
        x,
        y,
        lastX: x,
        lastY: y,
      });

      drawOverpaintingArea({ context, shouldRestore: false });
    },
    [
      absoluteScale,
      brushSize,
      drawOverpaintingArea,
      mode,
      panningEnabled,
      strokeColor.hex,
    ],
  );

  /**
   * 현재 마우스 움직임에 따른 마스크 그리기 함수
   */
  const draw = useCallback(
    (point: Vector2d) => {
      if (panningEnabled) {
        return;
      }

      // 마우스 이동 참조가 없으면 초기화
      if (!mouseMovementRef.current) {
        mouseMovementRef.current = {
          // 브러시 모드에 따라 합성 연산 설정 (브러시면 덮어쓰기, 아니면 지우기)
          globalCompositeOperation: isBrush ? 'source-over' : 'destination-out',
          hex: strokeColor.hex,
          lineWidth: brushSize,
          points: [],
        };
      }

      // 마우스 좌표를 캔버스 스케일에 맞게 변환
      const [x, y] = [
        Math.floor(point.x / absoluteScale),
        Math.floor(point.y / absoluteScale),
      ];
      // 현재 포인트를 포인트 배열에 추가
      mouseMovementRef.current.points.push([x, y]);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;

      if (!context) return;

      // 브러시 모드에 따라 합성 모드 설정
      context.globalCompositeOperation = isBrush
        ? 'source-over'
        : 'destination-out';

      context.strokeStyle = strokeColor.hex;
      // 이전 포인트 위치 가져오기 (없으면 현재 위치 사용)
      const [lastX = x, lastY = y] = lastPointerPosition.current;

      // 선 그리기
      renderStrokes({
        context,
        brushSize,
        x,
        y,
        lastX,
        lastY,
      });

      // 현재 포인트를 이전 포인트로 저장
      lastPointerPosition.current = [x, y];

      // 오버페인팅 영역 그리기
      drawOverpaintingArea({ context });
    },
    [
      panningEnabled,
      absoluteScale,
      isBrush,
      strokeColor.hex,
      brushSize,
      drawOverpaintingArea,
    ],
  );

  const drawLabel = useCallback(
    async (
      maskData: ProcessedImageData,
      borderData: string | null,
      x: number,
      y: number,
      redraw: boolean = false,
    ) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d') as
        | CanvasRenderingContext2D
        | OffscreenCanvasRenderingContext2D;
      const paintedImageData = maskToImageData(maskData, [
        strokeColor.rgba[0],
        strokeColor.rgba[1],
        strokeColor.rgba[2],
        255,
      ]);
      if (context && paintedImageData) {
        if (redraw) context.clearRect(0, 0, canvas.width, canvas.height);

        context.putImageData(paintedImageData, x, y);

        const imageData = context.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );

        pushToStack({
          borders: borderData,
          imageData,
        });
        layerRef?.current?.batchDraw();
        cursorLayerRef?.current?.batchDraw();
      }
    },
    [pushToStack, strokeColor.rgba],
  );

  const getMaskDataAndDrawLabel = useCallback(
    (label: ImageLabel) => {
      async function getImageData(label: ImageLabel) {
        setCanvasBusy(true);
        try {
          const { maskData, borderData } = (await getImageDataFromLabel(
            label,
            false,
            !label.borderData,
          )) as {
            maskData: ProcessedImageData;
            borderData: string;
          };
          if (maskData && maskExists) {
            const [x, y] = label.bbox;

            drawLabel(
              maskData,
              svgpath(label.borderData || borderData)
                .translate(x, y)
                .toString(),
              x,
              y,
            );
          }
          if (maskData && !maskExists) setMaskExists(true);
        } catch (error) {
          console.error(error);
          toast.error('Unknown error occurred');
        } finally {
          setCanvasBusy(false);
        }
      }
      getImageData(label);
    },
    [drawLabel, maskExists, setMaskExists],
  );

  const handleClearDrawing = useCallback(() => {
    triggerAction(null);
    const context = canvasRef.current.getContext('2d') as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D;

    if (context) {
      context.clearRect(0, 0, imageWidth, imageHeight);
      layerRef?.current?.batchDraw();
      cursorLayerRef?.current?.batchDraw();
    }
    const onScreenContext = onScreenCanvasRef.current.getContext(
      '2d',
    ) as CanvasRenderingContext2D;
    if (onScreenContext) {
      onScreenContext.clearRect(0, 0, imageWidth, imageHeight);
    }
    clearStack();
    if (editedLabel) getMaskDataAndDrawLabel(editedLabel);
    else setMaskExists(false);
  }, [
    clearStack,
    setMaskExists,
    editedLabel,
    getMaskDataAndDrawLabel,
    imageHeight,
    imageWidth,
    triggerAction,
  ]);

  const handleSaveMask = useCallback(() => {
    async function saveMask() {
      try {
        const { imageData } = getCurrentStackValue();

        if (!imageData) return;

        setCanvasBusy(true);

        const maskData = await getMaskToSave(imageData);

        if (maskData) {
          const { bbox, mask, borderData } = maskData;
          if (editedLabel) {
            updateLabels([
              {
                id: editedLabel.id,
                changes: {
                  bbox,
                  mask,
                  borderData: borderData ?? undefined,
                },
              },
            ]);
          } else {
            addLabels([
              {
                id: uuidv4(),
                bbox,
                mask,
                classLabelId: activeClassLabelId ?? undefined,
                borderData: borderData ?? undefined,
              },
            ]);

            handleClearDrawing();
          }
        } else if (!maskData && editedLabel) {
          deleteLabels([editedLabel.id]);
        }
      } catch (error) {
        console.error(error);
        toast.error('Unknown error occurred');
      } finally {
        setCanvasBusy(false);
      }
    }
    if (canvasBusy) return;
    triggerAction(null);
    resetActiveTool();
    saveMask();
  }, [
    activeClassLabelId,
    canvasBusy,
    resetActiveTool,
    triggerAction,
    getCurrentStackValue,
    handleClearDrawing,
    editedLabel,
    updateLabels,
    addLabels,
    deleteLabels,
  ]);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if ((e.evt as MouseEvent).button === 1 || canvasBusy) return;

      e.cancelBubble = true;
      paintRef.current = true;
      setIsPainting(true);

      if (!drawingRef.current) return;
      const stage = drawingRef.current.getStage();
      if (stage) {
        const coords = getStagePointerCoordinates(stage);
        if (coords) {
          if (!maskExists) setMaskExists(true);

          draw(coords);

          stage.batchDraw();
        }
      }
    },
    [canvasBusy, draw, maskExists, setMaskExists],
  );

  const handleMouseOut = useCallback(() => {
    paintRef.current = false;
    setIsPainting(false);
    lastPointerPosition.current = [];
  }, []);

  const handleMouseUp = useCallback(async () => {
    if (!isPainting || !paintRef.current) return;

    paintRef.current = false;
    setIsPainting(false);
    lastPointerPosition.current = [];
    setCanvasBusy(true);

    const result = await getCurrentImageData();

    if (result) {
      await pushToStack(result);
    }
    if (isBrush && !overpainting) {
      const context = canvasRef.current?.getContext('2d') as
        | CanvasRenderingContext2D
        | OffscreenCanvasRenderingContext2D
        | undefined;

      if (context) {
        drawOverpaintingArea({ context, shouldIntersect: false });
      }
    }
    mouseMovementRef.current = null;
    setCanvasBusy(false);
  }, [
    drawOverpaintingArea,
    getCurrentImageData,
    isBrush,
    isPainting,
    overpainting,
    pushToStack,
  ]);

  const handleMouseMove = useCallback(() => {
    const stage = drawingRef.current?.getStage();
    if (stage) {
      const coords = getStagePointerCoordinates(stage);

      if (coords) {
        const { x, y } = coords;

        circleRef.current?.setPosition({
          x: x / absoluteScale,
          y: y / absoluteScale,
        });
        if (paintRef.current && !canvasBusy) {
          draw({ x, y });
        }
        drawHovered({ x, y });
        layerRef?.current?.batchDraw();
        cursorLayerRef?.current?.batchDraw();
      }
    }
  }, [absoluteScale, canvasBusy, draw, drawHovered]);

  const handleFillClosedPath = useCallback(() => {
    async function closeMask() {
      setCanvasBusy(true);
      try {
        const { imageData } = getCurrentStackValue();
        if (!imageData) return;
        const result = await getClosedMask(imageData, combinedLabels);

        if (result) {
          drawLabel(result.maskData, result.borderData, 0, 0, true);
          setBorderData(result.borderData);
        }
      } catch (error) {
        console.error(error);
        toast.error('Unknown error occurred');
      } finally {
        setCanvasBusy(false);
      }
    }
    triggerAction(null);
    closeMask();
  }, [drawLabel, getCurrentStackValue, combinedLabels, triggerAction]);

  const handleUndoRedo = useCallback(
    async (imageData?: ImageData | null) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d') as
        | CanvasRenderingContext2D
        | OffscreenCanvasRenderingContext2D;

      if (context) {
        calculateBorderData();

        if (imageData) {
          context.putImageData(imageData, 0, 0);
        } else {
          context.clearRect(0, 0, imageWidth, imageHeight);
        }
      }
      layerRef?.current?.batchDraw();
      cursorLayerRef?.current?.batchDraw();
    },
    [calculateBorderData, imageHeight, imageWidth],
  );

  const handleUndo = useCallback(() => {
    if (undoRedoIndex.current === minUndoIndex && canUndo()) {
      undo();
    } else {
      undoStack();
      const { imageData } = getCurrentStackValue();
      handleUndoRedo(imageData);
    }
    triggerAction(null);
  }, [
    undo,
    getCurrentStackValue,
    handleUndoRedo,
    minUndoIndex,
    undoStack,
    triggerAction,
  ]);

  const handleRedo = useCallback(() => {
    if (
      canRedo() &&
      undoRedoIndex.current === undoRedoStackRef.current.length &&
      undoRedoStackRef.current.length === 1
    ) {
      redo();
    } else {
      redoStack();
      const { imageData } = getCurrentStackValue();
      handleUndoRedo(imageData);
    }
    triggerAction(null);
  }, [redo, triggerAction, getCurrentStackValue, handleUndoRedo, redoStack]);

  useEffect(() => {
    if (actionTrigger === 'discard') handleClearDrawing();
    if (actionTrigger === 'convert') handleSaveMask();
    if (actionTrigger === 'fillClosed') handleFillClosedPath();
    if (actionTrigger === 'undo') handleUndo();
    if (actionTrigger === 'redo') handleRedo();
  }, [
    actionTrigger,
    handleClearDrawing,
    handleFillClosedPath,
    handleRedo,
    handleSaveMask,
    handleUndo,
  ]);

  useEffect(() => {
    stage.on('mousedown.drawing', handleMouseDown);
    stage.on('mousemove.drawing', handleMouseMove);
    stage.on('mouseup.drawing', handleMouseUp);

    return () => {
      stage.off('mousedown.drawing mousemove.drawing mouseup.drawing');
      stage.container().removeEventListener('mouseout', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseOut, handleMouseUp, stage]);

  useEffect(() => clearStack, [clearStack]);

  useEffect(() => {
    // 초기 커서를 그리기 위해 handleMouseMove 호출
    handleMouseMove();
  }, [handleMouseMove]);

  useLayoutEffect(() => {
    if (editedLabel) {
      getMaskDataAndDrawLabel(editedLabel);
    }

    [canvasRef, hoverCanvasRef].forEach((ref) => {
      ref.current.width = imageWidth;
      ref.current.height = imageHeight;
    });

    const layerContext = layerRef.current?.getContext();
    const cursorLayerContext = cursorLayerRef.current?.getContext();

    if (layerContext) layerContext._context.imageSmoothingEnabled = false;
    if (cursorLayerContext)
      cursorLayerContext._context.imageSmoothingEnabled = false;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedLabel, imageWidth, imageHeight, maskExists]);

  useEffect(() => {
    if (isPainting) {
      borderAnimation.stop();
    } else {
      borderAnimation.start();
    }
  }, [borderAnimation, isPainting]);

  useEffect(() => {
    const labelsIds = labels.map(({ id }) => id);
    const deletedLabelIds = combinedLabelsIds.filter(
      (id) => !labelsIds.includes(id),
    );
    const updatedCombinedLabels = combinedLabels.filter(
      ({ id }) => !deletedLabelIds.includes(id),
    );
    const updatedCombinedLabelsIds = combinedLabelsIds.filter(
      (id) => !deletedLabelIds.includes(id),
    );

    if (combinedLabels.length !== updatedCombinedLabels.length) {
      setCombinedLabels(updatedCombinedLabels);
    }
    if (combinedLabelsIds.length !== updatedCombinedLabelsIds.length) {
      setCombinedLabelsIds(updatedCombinedLabelsIds);
    }
  }, [combinedLabels, combinedLabelsIds, labels, labels.length]);

  /* 오버페인팅을 위한 하단 레이블 캔버스 그리기 */
  useLayoutEffect(() => {
    async function getExistingLabelsData() {
      const updatedCombinedLabels = [...combinedLabels];
      const updatedCombinedLabelsIds = [...combinedLabelsIds];
      let changed = false;

      setCanvasBusy(true);

      try {
        for (const label of labels) {
          if (
            label.id !== editedLabel?.id &&
            !combinedLabelsIds.includes(label.id)
          ) {
            changed = true;
            const { bbox, mask, polygon, id, borderData } = label;
            updatedCombinedLabelsIds.push(id);

            if (mask && borderData) {
              updatedCombinedLabels.push({
                data: borderData,
                bbox,
                id,
              });
            } else if (mask && !borderData) {
              let result: {
                maskData: ImageData | null;
                borderData: string | null;
              } = { maskData: null, borderData: null };

              result = (await getImageDataFromLabel(
                label,
                true,
                true,
              )) as typeof result;

              updatedCombinedLabels.push({
                data: result.borderData,
                bbox,
                id,
              });
            } else if (polygon) {
              const data = convertPolygonToSVGPath(polygon, bbox);

              if (data) {
                updatedCombinedLabels.push({
                  data,
                  bbox,
                  id,
                });
              }
            } else if (bbox) {
              updatedCombinedLabels.push({
                data: null,
                bbox,
                id,
              });
            }
          }
        }

        if (changed) {
          setCombinedLabels(updatedCombinedLabels);
          setCombinedLabelsIds(updatedCombinedLabelsIds);
        }
      } catch (error) {
        console.error(error);
        toast.error('Unknown error occurred');
      }
      setCanvasBusy(false);
    }
    if (labels.length && isBrush && !overpainting) {
      getExistingLabelsData();
    }
  }, [
    combinedLabels,
    combinedLabelsIds,
    editedLabel?.id,
    isBrush,
    labels,
    overpainting,
  ]);

  // 단축키 설정
  useMaskToolShortcuts({
    handleDecreaseBrushSize,
    handleIncreaseBrushSize,
    toggleOverpainting,
    setBrush,
    setEraser,
    triggerAction,
    handleUndo,
    handleRedo,
    resetActiveTool,
    mode,
    editedLabel,
    undoRedoIndex,
  });

  return (
    <HotkeysProvider initiallyActiveScopes={['mask-tool']}>
      <Layer
        opacity={strokeColor.opacity}
        ref={layerRef}
        scaleX={absoluteScale}
        scaleY={absoluteScale}
      >
        <CursorSetter
          cursor={canvasBusy ? 'progress' : 'none'}
          key={JSON.stringify({
            panningEnabled,
            canvasBusy,
          })}
        />

        <Image image={canvasRef.current} alt="" />
        <Rect width={imageWidth} height={imageHeight} ref={drawingRef} />
      </Layer>
      <Layer ref={cursorLayerRef} scaleX={absoluteScale} scaleY={absoluteScale}>
        <StageScaleProvider>
          {(scale) => (
            <>
              {!panningEnabled && (
                <Circle
                  ref={circleRef}
                  opacity={canvasBusy ? 0 : 1}
                  radius={brushCursorRadius}
                  stroke={mode === 'brush' ? SLATE_GREY : BLACK}
                  strokeWidth={2 / scale / absoluteScale}
                  shadowColor={SLATE_GREY}
                  shadowBlur={4 / scale / absoluteScale}
                  shadowOffset={{ x: 0, y: 0 }}
                  shadowOpacity={1}
                />
              )}
            </>
          )}
        </StageScaleProvider>

        <Image
          image={hoverCanvasRef.current}
          opacity={canvasBusy ? 0 : 1}
          alt="hover-canvas"
        />
        {borderData && (
          <Path
            visible={!isPainting && !canvasBusy}
            data={borderData}
            width={imageWidth}
            height={imageHeight}
            stroke="white"
            dash={[7, 3]}
            strokeWidth={2}
            fill={fill}
            listening={false}
            strokeScaleEnabled={false}
            shadowForStrokeEnabled={false}
            ref={borderRef}
          />
        )}
      </Layer>
    </HotkeysProvider>
  );
};

export default MaskTool;
