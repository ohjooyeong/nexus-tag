import Konva from 'konva';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useImageClamping } from '../../_provider/image-clamping-context-provider';
import { usePanningStore } from '../../_store/panning-store';
import { useKonvaStage } from '../../_provider/konva-stage-context-provider';
import { ImageLabel } from '../../_types/image-label';
import { KonvaEventObject } from 'konva/lib/Node';
import { Polygon } from '../../_types/types';
import {
  addDividingPoints,
  isPolygonValid,
  nextIndex,
  nextVertex,
  prevIndex,
  prevVertex,
} from '../../_helpers/polygon/polygon.helpers';
import { useLabelsStore } from '../../_store/label-collection/labels-store';
import { calculateBbox, getHeight, getWidth } from '../../_utils/utils';
import { roundPositionToPixel } from '../../_helpers/image-view/common.helpers';
import { toast } from 'sonner';
import { Vector2d } from 'konva/lib/types';
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook';
import CursorSetter from '../../_components/cursor/cursor-setter';
import { StageScaleProvider } from '../../_provider/stage-scale-provider';
import { Circle, Group, Line } from 'react-konva';
import { DRAG_DISTANCE, EDIT_FILL_COLOR } from '../../_constants/constants';
import { WHITE } from '../../_constants/colors';
import CursorCrosshair from '../../_components/cursor/cursor-crosshair';

type EditedPolygonProps = {
  label: ImageLabel;
  absoluteScale: number;
  fill: string;
  stroke: string;
  onDragStart?: (e: KonvaEventObject<MouseEvent>) => void;
  dragBoundFunc?: (pos: Konva.Vector2d) => Konva.Vector2d;
  onMouseOut?: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOver?: (e: KonvaEventObject<MouseEvent>) => void;
  isDragged?: boolean;
};

const EditedPolygon = ({
  label,
  absoluteScale,
  fill,
  stroke,
  onDragStart,
  dragBoundFunc,
  onMouseOut,
  onMouseOver,
  isDragged,
}: EditedPolygonProps) => {
  const stage = useKonvaStage();

  const { getEnabledPanning } = usePanningStore();
  const { updateLabels, deleteLabels } = useLabelsStore();
  const { restrictEntityToImage } = useImageClamping();

  const panningEnabled = getEnabledPanning();

  const [lineIsDragging, setLineIsDragging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const groupRef = useRef<Konva.Group>(null);

  const showCrosshairs = isDragging && !panningEnabled;
  const { bbox } = label;
  const relativeVertexes = useMemo<Polygon>(
    () => label.polygon?.map(([x, y]) => [x - bbox[0], y - bbox[1]]) || [],
    [bbox, label.polygon],
  );

  const [vertexes, setVertexes] = useState<Polygon>(
    addDividingPoints(relativeVertexes),
  );

  const [hoveredVertexIndex, setHoveredVertexIndex] = useState<number | null>(
    null,
  );
  const [selectedVertexIndexes, setSelectedVertexIndexes] = useState<number[]>(
    [],
  );

  useEffect(() => {
    setVertexes(addDividingPoints(relativeVertexes));
  }, [relativeVertexes]);

  useEffect(() => {
    if (groupRef.current && label.bbox) {
      groupRef.current.position({
        x: label.bbox[0] * absoluteScale,
        y: label.bbox[1] * absoluteScale,
      });
    }
  }, [absoluteScale, label.bbox]);

  // 폴리곤의 변경사항을 저장하고 라벨을 업데이트하는 함수
  const doSave = useCallback(
    (vertexes: Polygon, isDrag: boolean = false) => {
      if (groupRef.current) {
        const position = groupRef.current.position();
        const filteredVertexes = vertexes.filter((v, i) => i % 2 === 0);
        const updatedVertexes = filteredVertexes.map(
          ([x, y]) =>
            [
              Math.round(x + position.x / absoluteScale),
              Math.round(y + position.y / absoluteScale),
            ] as [number, number],
        );

        updateLabels(
          [
            {
              id: label.id,
              changes: {
                polygon: updatedVertexes,
                bbox: calculateBbox(updatedVertexes.flat()),
              },
            },
          ],

          isDrag ? 'move' : undefined,
        );
      }
    },
    [absoluteScale, label.id, updateLabels],
  );

  // 버텍스에 마우스가 진입했을 때의 핸들러
  const handleVertexMouseEnter = (
    i: number,
    e: KonvaEventObject<MouseEvent>,
  ) => {
    e.evt.preventDefault();
    setHoveredVertexIndex(i);
  };

  // 버텍스에서 마우스가 벗어났을 때의 핸들러
  const handleVertexMouseLeave = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.evt.preventDefault();
      setHoveredVertexIndex(null);
    },
    [],
  );

  // 버텍스 클릭 핸들러 (다중 선택 지원)
  const handleVertexClick = (i: number, e: KonvaEventObject<MouseEvent>) => {
    if (i % 2) {
      return;
    }
    if (e.evt.shiftKey) {
      if (selectedVertexIndexes.includes(i)) {
        setSelectedVertexIndexes((idx) => idx.filter((ind) => ind !== i));
      } else {
        setSelectedVertexIndexes((idx) => [...idx, i]);
      }
    } else if (
      selectedVertexIndexes.includes(i) &&
      selectedVertexIndexes.length === 0
    ) {
      setSelectedVertexIndexes([]);
    } else {
      setSelectedVertexIndexes([i]);
    }
  };

  // 폴리곤 라인의 점들을 계산하는 메모이제이션 함수
  const polygonLinePoints = useMemo(
    () =>
      vertexes
        .filter((v, i) =>
          isDragging ? i === hoveredVertexIndex || i % 2 === 0 : true,
        )
        .flat()
        .map((v) => v * absoluteScale),
    [absoluteScale, hoveredVertexIndex, isDragging, vertexes],
  );

  const vertexesDragCopyRef = useRef(vertexes);
  const isSelectedVertexDragRef = useRef(false);
  const dragStartPositionRef = useRef({ x: 0, y: 0 });

  const groupX = bbox[0] * absoluteScale;
  const groupY = bbox[1] * absoluteScale;

  // 버텍스 드래그 시작 핸들러
  const handleDragStart = useCallback(
    (i: number) => (e: KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true;

      setIsDragging(true);
      setHoveredVertexIndex(i);
      vertexesDragCopyRef.current = vertexes;
      isSelectedVertexDragRef.current = selectedVertexIndexes.includes(i);
      dragStartPositionRef.current = e.target.position();
    },
    [selectedVertexIndexes, vertexes],
  );

  // 버텍스 드래그 중 핸들러
  const handleVertexDrag = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      e.evt.preventDefault();

      // 현재 위치와 스케일을 기반으로 반올림된 좌표 가져오기
      const coords = roundPositionToPixel(e.target.position(), absoluteScale);
      if (!coords || hoveredVertexIndex === null) {
        return;
      }

      // 현재 X좌표와 원래 위치의 차이 계산
      const diffX =
        coords.x -
        vertexesDragCopyRef.current[hoveredVertexIndex][0] * absoluteScale;

      // 현재 Y좌표와 원래 위치의 차이 계산
      const diffY =
        coords.y -
        vertexesDragCopyRef.current[hoveredVertexIndex][1] * absoluteScale;

      // 버텍스 위치 업데이트
      setVertexes(
        vertexesDragCopyRef.current
          .map((vertex, i) => {
            // 현재 버텍스가 호버되었거나 선택된 경우 위치 업데이트
            if (
              i === hoveredVertexIndex ||
              (isSelectedVertexDragRef.current &&
                selectedVertexIndexes.includes(i))
            ) {
              return [
                [
                  // 새로운 위치 계산
                  vertexesDragCopyRef.current[i][0] + diffX / absoluteScale,
                  vertexesDragCopyRef.current[i][1] + diffY / absoluteScale,
                ],
              ] as Polygon;
            }

            // 드래그되지 않은 버텍스는 변경하지 않고 반환
            return [vertex] as Polygon;
          })
          .flat(),
      );
    },
    [absoluteScale, hoveredVertexIndex, selectedVertexIndexes],
  );

  // 버텍스 드래그 종료 핸들러
  const handleVertexDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true;

      setIsDragging(false);
      // 호버된 버텍스가 없으면 종료
      if (hoveredVertexIndex === null) {
        return;
      }
      // 현재 위치를 픽셀 단위로 반올림
      const coords = roundPositionToPixel(e.target.position(), absoluteScale);
      if (!coords) {
        return;
      }
      // 타겟의 위치 업데이트
      e.target.position(coords);

      // 중간점인 경우 다음 버텍스를 선택
      if (hoveredVertexIndex % 2) {
        setSelectedVertexIndexes([hoveredVertexIndex + 1]);
        // 선택된 버텍스가 없는 경우 현재 버텍스를 선택
      } else if (selectedVertexIndexes.length === 0) {
        setSelectedVertexIndexes([hoveredVertexIndex]);
      }
      // 새로운 버텍스 배열 생성
      let newVertexes = vertexes
        .map((vertex, i, all) => {
          // 호버된 버텍스 처리
          if (i === hoveredVertexIndex) {
            // 중간점인 경우
            if (hoveredVertexIndex % 2) {
              // 이전과 다음 버텍스 가져오기
              const lineStartingVertex = prevVertex(i, all);
              const lineEndingVertex = nextVertex(i, all);

              // 중간점의 새로운 위치 계산
              return [
                [
                  (lineStartingVertex[0] + vertex[0]) / 2,
                  (lineStartingVertex[1] + vertex[1]) / 2,
                ],
                [coords.x / absoluteScale, coords.y / absoluteScale],
                [
                  (lineEndingVertex[0] + vertex[0]) / 2,
                  (lineEndingVertex[1] + vertex[1]) / 2,
                ],
              ];
            }

            // 일반 버텍스인 경우 새로운 위치로 업데이트
            return [[coords.x / absoluteScale, coords.y / absoluteScale]];
          }
          // 호버된 버텍스가 일반 버텍스인 경우
          if (hoveredVertexIndex % 2 === 0) {
            // 이전 버텍스 처리
            if (i === prevIndex(hoveredVertexIndex, all)) {
              const lineStartingVertex = prevVertex(i, all);

              // 이전 중간점의 새로운 위치 계산
              return [
                [
                  (lineStartingVertex[0] + coords.x / absoluteScale) / 2,
                  (lineStartingVertex[1] + coords.y / absoluteScale) / 2,
                ],
              ];
            }
            // 다음 버텍스 처리
            if (i === nextIndex(hoveredVertexIndex, all)) {
              const lineEndingVertex = nextVertex(i, all);

              // 다음 중간점의 새로운 위치 계산
              return [
                [
                  (lineEndingVertex[0] + coords.x / absoluteScale) / 2,
                  (lineEndingVertex[1] + coords.y / absoluteScale) / 2,
                ],
              ];
            }
          }

          // 변경되지 않은 버텍스 반환
          return [vertex];
        })
        .flat() as Polygon;
      // 폴리곤이 유효한 경우
      if (isPolygonValid(newVertexes)) {
        // 바운딩 박스 계산
        const tempBbox = calculateBbox(newVertexes.flat());
        if (tempBbox[0] || tempBbox[1]) {
          // 버텍스 위치 조정
          newVertexes = newVertexes.map(([x, y]) => [
            x - tempBbox[0],
            y - tempBbox[1],
          ]);
          // 그룹 위치 업데이트
          if (groupRef.current) {
            const pos = groupRef.current.position();
            groupRef.current.position({
              x: pos.x + tempBbox[0] * absoluteScale,
              y: pos.y + tempBbox[1] * absoluteScale,
            });
          }
        }

        // 새로운 버텍스 저장
        setVertexes(newVertexes);
        // 변경사항 저장
        doSave(newVertexes);
      } else {
        // 폴리곤이 유효하지 않은 경우 에러 메시지 표시
        toast.info('Your polygon appears to have no area. Try again');
      }
    },
    [
      hoveredVertexIndex,
      absoluteScale,
      selectedVertexIndexes.length,
      vertexes,
      doSave,
    ],
  );

  // 폴리곤 라인 드래그 종료 핸들러
  const handleLineDragEnd = useCallback(() => {
    doSave(vertexes, true);
    setLineIsDragging(false);
  }, [doSave, vertexes]);

  // 폴리곤 라인 드래그 시작 핸들러
  const handleLineDragStart = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      setLineIsDragging(true);
      onDragStart?.(e);
    },
    [onDragStart],
  );

  // 버텍스 드래그 경계 제한 함수
  const handleVertexDragBoundFunc = useCallback(
    (pos: Vector2d) => {
      if (!isSelectedVertexDragRef.current) {
        return restrictEntityToImage(pos);
      }

      const diffX = pos.x - groupX - stage.x() - dragStartPositionRef.current.x;
      const diffY = pos.y - groupY - stage.y() - dragStartPositionRef.current.y;

      const selectedBbox = calculateBbox(
        selectedVertexIndexes
          .map((si) => vertexesDragCopyRef.current[si])
          .flat()
          .map(
            (n, i) =>
              n * absoluteScale + (i % 2 ? groupY + diffY : groupX + diffX),
          ),
      );

      const restrictedPosition = restrictEntityToImage(
        { x: selectedBbox[0] + stage.x(), y: selectedBbox[1] + stage.y() },
        {
          width: getWidth(selectedBbox),
          height: getHeight(selectedBbox),
        },
      );

      return {
        x: pos.x + restrictedPosition.x - (selectedBbox[0] + stage.x()),
        y: pos.y + restrictedPosition.y - (selectedBbox[1] + stage.y()),
      };
    },
    [
      absoluteScale,
      groupX,
      groupY,
      restrictEntityToImage,
      selectedVertexIndexes,
      stage,
    ],
  );

  // 버텍스 점의 반지름을 계산하는 함수
  const calculateDotRadius = useCallback(
    (i: number) => {
      if (selectedVertexIndexes.includes(i)) {
        return 6;
      }
      if (i === hoveredVertexIndex) {
        return 5;
      }
      if (i % 2) {
        return 3;
      }

      return 4;
    },
    [selectedVertexIndexes, hoveredVertexIndex],
  );

  useHotkeys(
    ['delete', 'backspace', 'del'],
    () => {
      if (selectedVertexIndexes.length) {
        if (label.polygon) {
          const newPolygon = label.polygon.filter((vertex, i) =>
            selectedVertexIndexes.includes(i * 2) ? null : vertex,
          );
          if (isPolygonValid(newPolygon)) {
            updateLabels([
              {
                id: label.id,
                changes: {
                  polygon: newPolygon,
                  bbox: calculateBbox(newPolygon.flat()),
                },
              },
            ]);
          }
        }
      } else {
        deleteLabels([label.id]);
      }
    },
    { scopes: 'edited-polygon' },
  );

  const getCursor = () => {
    if (hoveredVertexIndex !== null && !isDragging) return 'grab';
    if (isDragging) return 'grabbing';

    return 'auto';
  };

  return (
    <HotkeysProvider initiallyActiveScopes={['edited-polygon']}>
      <CursorSetter cursor={getCursor()} />
      <StageScaleProvider>
        {(scale) => (
          <Group
            ref={groupRef}
            x={groupX}
            y={groupY}
            onDragStart={handleLineDragStart}
            onDragEnd={handleLineDragEnd}
            draggable
            dragDistance={DRAG_DISTANCE}
            dragBoundFunc={dragBoundFunc}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
          >
            <Line
              dash={[7 / scale, 3 / scale]}
              points={polygonLinePoints}
              dragDistance={DRAG_DISTANCE}
              stroke={stroke}
              strokeWidth={1 / scale}
              fill={fill}
              id={label.id}
              name="polygon"
              isDragged={isDragged}
              closed
            />
            {!lineIsDragging &&
              vertexes.map((vertex, i) => (
                <Circle
                  data-testid={`polygonPoint-${i}`}
                  onMouseEnter={(e) => handleVertexMouseEnter(i, e)}
                  onMouseLeave={handleVertexMouseLeave}
                  onClick={(e) => handleVertexClick(i, e)}
                  x={vertex[0] * absoluteScale}
                  y={vertex[1] * absoluteScale}
                  visible={
                    i === hoveredVertexIndex ||
                    (isDragging && i % 2 === 0) ||
                    !isDragging
                  }
                  draggable
                  dragBoundFunc={handleVertexDragBoundFunc}
                  onDragStart={handleDragStart(i)}
                  onDragMove={handleVertexDrag}
                  onDragEnd={handleVertexDragEnd}
                  key={i}
                  radius={calculateDotRadius(i) / scale}
                  fill={EDIT_FILL_COLOR}
                  stroke={i === hoveredVertexIndex ? EDIT_FILL_COLOR : WHITE}
                  strokeWidth={i % 2 ? 0 : 2 / scale}
                />
              ))}
          </Group>
        )}
      </StageScaleProvider>
      {showCrosshairs && <CursorCrosshair />}
    </HotkeysProvider>
  );
};

export default EditedPolygon;
