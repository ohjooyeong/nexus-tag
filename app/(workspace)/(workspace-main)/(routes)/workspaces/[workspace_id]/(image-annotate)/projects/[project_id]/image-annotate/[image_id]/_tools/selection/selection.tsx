import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MyRBush } from '../../_helpers/image-view/data.helpers';
import { useCanvasDimensions } from '../../_provider/canvas-dimensions-context-provider';
import { ImageLabel } from '../../_types/image-label';
import Konva from 'konva';
import { usePanningStore } from '../../_store/panning-store';
import { useKonvaStage } from '../../_provider/konva-stage-context-provider';
import { useImageClamping } from '../../_provider/image-clamping-context-provider';
import { calculateBbox } from '../../_utils/utils';
import { useSelectedLabelsStore } from '../../_store/label-collection/selected-labels-store';
import { useLabelsStore } from '../../_store/label-collection/labels-store';
import { KonvaEventObject } from 'konva/lib/Node';
import { isEqual, throttle } from 'lodash';
import { Vector2d } from 'konva/lib/types';
import { Layer as LayerType } from 'konva/lib/Layer';
import { Bbox } from '../../_types/types';
import { snapToPixel } from '../../_helpers/image-view/common.helpers';
import { Layer, Line, Rect } from 'react-konva';
import CursorSetter from '../../_components/cursor/cursor-setter';
import { WHITE } from '../../_constants/colors';
import AlwaysOnTop from '../../_components/always-on-top/always-on-top';
import { DRAG_DISTANCE } from '../../_constants/constants';

type SelectionProps = {
  labels: ImageLabel[];
  width: number;
  height: number;
  processedLabelsTree: MyRBush;
};

type KonvaBbox = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const Selection = ({
  labels,
  width,
  height,
  processedLabelsTree,
}: SelectionProps) => {
  const { absoluteScale } = useCanvasDimensions();
  const { restrictEntityToImage } = useImageClamping();

  const stage = useKonvaStage();

  const { getEnabledPanning } = usePanningStore();
  const { getSelectedLabelIds, setSelectedLabelIds, toggleLabelSelection } =
    useSelectedLabelsStore();
  const { getLabelsMap, updateLabels } = useLabelsStore();

  const panningEnabled = getEnabledPanning();
  const selectedLabelsIds = getSelectedLabelIds();
  const labelsMap = getLabelsMap();

  const marqueeRef = useRef<Konva.Rect | null>(null);
  const selectionRef = useRef<Konva.Line | null>(null);

  const [isDragged, setIsDragged] = useState(false);

  const [marqueeInitialCoordinates, setMarqueeInitialCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selection, setSelection] = useState<number[]>([]);
  const [selectionBbox, setSelectionBbox] = useState<KonvaBbox | undefined>(
    undefined,
  );

  const [multiSelecting, setMultiSelecting] = useState(false); // 단축키 만들때 사용 예정
  const [selectionHovered, setSelectionHovered] = useState(false);
  const [selectionDragging, setSelectionDragging] = useState(false);
  const [labelHovered, setLabelHovered] = useState(false);

  // 선택된 영역이 이미지 범위를 벗어나지 않도록 제한하는 함수
  const handleDragBound = useCallback(
    (pos: Konva.Vector2d) =>
      restrictEntityToImage(pos, {
        width: selectionRef.current?.width() || 0,
        height: selectionRef.current?.height() || 0,
      }),
    [restrictEntityToImage],
  );

  // 마우스 클릭 시 선택 영역 시작점 설정
  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (e.evt instanceof MouseEvent && e.evt.button === 1) return;

      e.cancelBubble = true;
      const pointer = stage.getPointerPosition();
      if (pointer) {
        if (!multiSelecting) setSelectedLabelIds([]);
        setMarqueeInitialCoordinates({
          x: pointer.x,
          y: pointer.y,
        });
      }
    },
    [setSelectedLabelIds, multiSelecting, stage],
  );

  // 선택 박스 크기 결정 및 선택 영역 업데이트
  useEffect(() => {
    if (selectedLabelsIds.length > 0) {
      const selectedLabels = labels.filter((label: ImageLabel) =>
        selectedLabelsIds.includes(label.id),
      );

      const labelsBboxes = selectedLabels
        .map((label: ImageLabel) => label.bbox)
        .flat()
        .map((x: number) => x * absoluteScale);
      const bbox = calculateBbox(labelsBboxes);

      setSelection(bbox);
    } else {
      setSelectionBbox({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    }
  }, [labels, absoluteScale, width, selectedLabelsIds]);

  useEffect(() => {
    if (selection.length > 0) {
      setSelectionBbox(
        selectionRef?.current?.getClientRect({
          skipTransform: true,
          skipStroke: true,
        }),
      );
    }
  }, [selection]);

  // 마킹된 영역 내의 도형들을 선택하는 함수
  const parseShapesSelection = useCallback(
    (_showContextMenu: boolean) => {
      const marquee = marqueeRef.current;
      if (!marquee) return; //

      const stageX = stage.x();
      const stageY = stage.y();
      const stageScale = stage.scaleX();
      const marqueeRect = marquee.getClientRect({}) || {};
      const selectionBox = {
        minX: (marqueeRect.x - stageX) / absoluteScale / stageScale,
        minY: (marqueeRect.y - stageY) / absoluteScale / stageScale,
        maxX:
          (marqueeRect.x + marqueeRect.width - stageX) /
          absoluteScale /
          stageScale,
        maxY:
          (marqueeRect.y + marqueeRect.height - stageY) /
          absoluteScale /
          stageScale,
      };
      const result = processedLabelsTree.search(selectionBox);

      if (marquee) {
        const resultSelectedLabelsIds = result
          .map((label) => label.id)
          .sort((a, b) => (a > b ? 1 : -1));
        if (!isEqual(resultSelectedLabelsIds, selectedLabelsIds)) {
          if (multiSelecting) {
            setSelectedLabelIds([
              ...[...resultSelectedLabelsIds, ...selectedLabelsIds],
            ]);
          } else {
            setSelectedLabelIds(resultSelectedLabelsIds);
          }
        }
      }
    },
    [
      setSelectedLabelIds,
      absoluteScale,
      multiSelecting,
      processedLabelsTree,
      selectedLabelsIds,
      stage,
    ],
  );

  // 마킹된 영역 내의 도형들을 선택하는 함수 (throttle 적용)
  const parseShapesSelectionThrottled = useMemo(
    (_showContextMenu: boolean = false) =>
      throttle<(_showContextMenu: boolean) => void>(
        () => parseShapesSelection(_showContextMenu),
        100,
        {
          leading: false,
        },
      ),
    [parseShapesSelection],
  );

  // 마우스 포인터 위치에 따라 선택 영역 업데이트
  const processPointerPosition = useCallback(
    (pointer: Vector2d | null, isRightClick = false) => {
      if (marqueeInitialCoordinates && pointer) {
        const marquee = marqueeRef.current;
        if (marquee) {
          const stageX = stage.x();
          const stageY = stage.y();
          const stageScaleX = stage.scaleX();
          const stageScaleY = stage.scaleY();
          const x1 = (marqueeInitialCoordinates.x - stageX) / stageScaleX;
          const y1 = (marqueeInitialCoordinates.y - stageY) / stageScaleY;
          const x2 = (pointer.x - stageX) / stageScaleX;
          const y2 = (pointer.y - stageY) / stageScaleY;

          marquee
            .setAttrs({
              x: Math.min(x1, x2),
              y: Math.min(y1, y2),
              width: Math.abs(x2 - x1),
              height: Math.abs(y2 - y1),
            })
            .getLayer()
            ?.batchDraw();
          parseShapesSelectionThrottled(isRightClick);
        }
      }
    },
    [marqueeInitialCoordinates, stage, parseShapesSelectionThrottled],
  );

  const handleMouseMove = useCallback(
    (event: KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true;
      const pointer = stage.getPointerPosition();
      processPointerPosition(pointer);
    },
    [processPointerPosition, stage],
  );

  const handleMouseUp = useCallback(() => {
    setSelectionDragging(false);
    if (marqueeInitialCoordinates) {
      const pointer = stage.getPointerPosition();
      processPointerPosition(pointer);
    }
    setMarqueeInitialCoordinates(null);
  }, [marqueeInitialCoordinates, processPointerPosition, stage]);

  useEffect(() => {
    if (!panningEnabled) {
      stage.on('mouseup.selection', handleMouseUp);
    }

    return () => {
      stage.off('mouseup.selection');
    };
  }, [handleMouseUp, panningEnabled, stage]);

  useEffect(() => {
    if (!panningEnabled && marqueeInitialCoordinates) {
      stage.on('mousemove.selection', handleMouseMove);
    }

    return () => {
      stage.off('mousemove.selection');
    };
  }, [
    handleMouseMove,
    handleMouseUp,
    marqueeInitialCoordinates,
    panningEnabled,
    stage,
  ]);

  const handleSelectionMouseDown = useCallback(
    (event: KonvaEventObject<MouseEvent>) => {
      setSelectionDragging(true);
      event.cancelBubble = true;
    },
    [],
  );

  const labelsDragOriginsRef = useRef<{
    [k: string]: { x: number; y: number };
  }>({});

  // 선택 영역 드래그 시작 시 처리
  const handleSelectionDragStart = useCallback(() => {
    setIsDragged(true);
    selectedLabelsIds.forEach((id) => {
      const shape = stage.findOne(`#${id}`);
      if (shape) {
        labelsDragOriginsRef.current[id] = { ...shape.position() };
      }
    });
  }, [selectedLabelsIds, stage]);

  // 선택 영역 드래그 중 실시간 위치 업데이트
  const handleSelectionDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const pos = e.target.position();
      selectedLabelsIds.forEach((id) => {
        const shape = stage.findOne(`#${id}`);
        if (shape && selectionBbox && labelsDragOriginsRef.current[id]) {
          shape.position({
            x: labelsDragOriginsRef.current[id].x + pos.x - selectionBbox.x,
            y: labelsDragOriginsRef.current[id].y + pos.y - selectionBbox.y,
          });
        }
      });
      stage.batchDraw();
    },
    [selectedLabelsIds, selectionBbox, stage],
  );

  // 선택 영역 드래그 종료 시 최종 위치 저장 및 업데이트
  const handleSelectionDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      setIsDragged(false);

      if (!e.evt) {
        return;
      }

      const snappedSelectionPosition = {
        x: snapToPixel(e.target.x(), absoluteScale),
        y: snapToPixel(e.target.y(), absoluteScale),
      };
      e.target.position(snappedSelectionPosition);

      setSelectionBbox({
        ...snappedSelectionPosition,
        width: e.target.width(),
        height: e.target.height(),
      });

      const data: Array<Partial<ImageLabel> & { id: string }> = [];

      selectedLabelsIds.forEach((id) => {
        const shape = stage.findOne(`#${id}`);

        if (shape) {
          const snappedX = snapToPixel(shape.x(), absoluteScale);
          const snappedY = snapToPixel(shape.y(), absoluteScale);

          if (shape.name() === 'polygon') {
            const label = labelsMap[id];
            if (label && label.polygon) {
              const points = label.polygon.map(
                ([x, y]) =>
                  [
                    Math.round(
                      x +
                        (snappedX - labelsDragOriginsRef.current[id].x) /
                          absoluteScale,
                    ),
                    Math.round(
                      y +
                        (snappedY - labelsDragOriginsRef.current[id].y) /
                          absoluteScale,
                    ),
                  ] as [number, number],
              );

              data.push({
                id,
                polygon: points,
                bbox: calculateBbox(points.flat()),
              });
            }
          } else {
            const bbox = [
              Math.round(snappedX / absoluteScale),
              Math.round(snappedY / absoluteScale),
              Math.round(
                snapToPixel(snappedX + shape.width(), absoluteScale) /
                  absoluteScale,
              ),
              Math.round(
                snapToPixel(snappedY + shape.height(), absoluteScale) /
                  absoluteScale,
              ),
            ] as Bbox;
            data.push({
              id,
              bbox,
            });
            shape.position({
              x: snappedX,
              y: snappedY,
            });
          }
        }
      });

      updateLabels(
        data.map((datum) => ({
          id: datum.id,
          changes: {
            bbox: datum.bbox,
            polygon: datum.polygon,
          },
        })),

        'move',
      );
    },
    [updateLabels, absoluteScale, labelsMap, selectedLabelsIds, stage],
  );

  const handleSelectionMouseEnter = useCallback(() => {
    setSelectionHovered(true);
  }, []);

  const handleSelectionMouseLeave = useCallback(() => {
    setSelectionHovered(false);
  }, []);

  const handleSelectionMouseMove = useCallback(() => {
    const labelsLayer = stage.findOne('.labelsLayer') as LayerType | undefined;
    const pointerPosition = stage.getPointerPosition();

    if (labelsLayer && pointerPosition) {
      const target = labelsLayer.getIntersection(pointerPosition);

      if (target && target.attrs.id) {
        setLabelHovered(true);
      } else {
        setLabelHovered(false);
      }
    }
  }, [stage]);

  // 선택 영역 클릭 처리 (단일/다중 선택)
  const handleClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if ('touches' in e.evt) {
        return;
      }
      const labelsLayer = stage.findOne('.labelsLayer') as
        | LayerType
        | undefined;
      const pointerPosition = stage.getPointerPosition();

      if (labelsLayer && pointerPosition) {
        const target = labelsLayer.getIntersection(pointerPosition);
        if (target && target.attrs.id) {
          if (e.evt.shiftKey) {
            toggleLabelSelection(target.attrs.id);
          } else {
            setSelectedLabelIds([target.attrs.id]);
          }
        }
      }
    },
    [stage, toggleLabelSelection, setSelectedLabelIds],
  );

  // 마우스 커서 스타일 결정
  const getCursor = () => {
    if (labelHovered) return 'pointer';
    if (selectionHovered && !selectionDragging) return 'grab';
    if (selectionDragging) return 'grabbing';

    return 'auto';
  };

  return (
    <Layer key={selectedLabelsIds.join('/')}>
      <CursorSetter cursor={getCursor()} />
      <Rect
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        width={width}
        height={height}
      />
      <Line
        ref={selectionRef}
        perfectDrawEnabled={false}
        points={selection}
        strokeScaleEnabled={false}
        shadowForStrokeEnabled={false}
        stroke={WHITE}
        visible={false}
      />
      {selectedLabelsIds.length > 1 ? (
        <AlwaysOnTop enabled name="aot_selection">
          <Rect
            {...selectionBbox}
            draggable
            dragDistance={DRAG_DISTANCE}
            onClick={handleClick}
            onTap={handleClick}
            onMouseDown={handleSelectionMouseDown}
            onDragStart={handleSelectionDragStart}
            onDragEnd={handleSelectionDragEnd}
            onDragMove={handleSelectionDragMove}
            onMouseEnter={handleSelectionMouseEnter}
            onMouseLeave={handleSelectionMouseLeave}
            onMouseMove={handleSelectionMouseMove}
            dragBoundFunc={handleDragBound}
            strokeScaleEnabled={false}
            stroke="white"
            isDragged={isDragged}
          />
        </AlwaysOnTop>
      ) : null}
      {marqueeInitialCoordinates && (
        <Rect
          ref={marqueeRef}
          strokeScaleEnabled={false}
          fill="yellow"
          opacity={0.25}
          listening={false}
        />
      )}
    </Layer>
  );
};

export default Selection;
