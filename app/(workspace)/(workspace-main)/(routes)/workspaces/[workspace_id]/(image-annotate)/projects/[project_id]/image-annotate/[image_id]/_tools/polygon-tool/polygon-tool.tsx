import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useCanvasDimensions } from '../../_provider/canvas-dimensions-context-provider';
import { useKonvaStage } from '../../_provider/konva-stage-context-provider';
import { useClassLabelStore } from '../../_store/class-label-store';
import {
  useLabelsHistory,
  useLabelsStore,
} from '../../_store/label-collection/labels-store';
import { usePanningStore } from '../../_store/panning-store';
import { Polygon } from '../../_types/types';
import { useLatest, useStateWithHistory, usePrevious } from 'react-use';
import { useImageClamping } from '../../_provider/image-clamping-context-provider';
import { getStagePointerCoordinatesSnappedToPixel } from '../../_helpers/image-view/common.helpers';
import { KonvaEventObject } from 'konva/lib/Node';
import { v4 as uuidv4 } from 'uuid';
import { calculateBbox } from '../../_utils/utils';
import { LabelType } from '../../_types/image-label';
import { useImageStore } from '../../_store/image-store';
import { isPolygonValid } from '../../_helpers/polygon/polygon.helpers';
import { Circle, Layer, Line, Rect } from 'react-konva';
import CursorSetter from '../../_components/cursor/cursor-setter';
import { StageScaleProvider } from '../../_provider/stage-scale-provider';
import CursorCrosshair from '../../_components/cursor/cursor-crosshair';
import {
  EDIT_FILL_COLOR,
  POTENTIAL_LABEL_FILL_COLOR,
  POTENTIAL_LABEL_STROKE_COLOR,
} from '../../_constants/constants';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { useToolStore } from '../../_store/tool-store';
import { usePolygonToolShortcuts } from './use-polygon-tool-shortcuts';

type PolygonToolProps = {
  width: number;
  height: number;
};

const shouldVertexClickClosePolygon = (
  vertices: Polygon,
  vertexIndex: number,
) =>
  isPolygonValid(vertices) &&
  (vertexIndex === 0 || vertexIndex === vertices.length - 1);

const PolygonTool = ({ width, height }: PolygonToolProps) => {
  const stage = useKonvaStage();
  const { absoluteScale } = useCanvasDimensions();
  const { getEnabledPanning } = usePanningStore();
  const { addLabels } = useLabelsStore();
  const { getActiveClassLabelId } = useClassLabelStore();
  const { getImageId } = useImageStore();
  const { resetActiveTool } = useToolStore();
  const { undo, redo, futureStates, pastStates } = useLabelsHistory(
    (state) => state,
  );
  const canUndo = () => pastStates.length > 0;
  const canRedo = () => futureStates.length > 0;

  const activeClassLabelId = getActiveClassLabelId();
  const panningEnabled = getEnabledPanning();
  const imageId = getImageId();
  const prevImageId = usePrevious(imageId);
  const showCrosshairs = !panningEnabled;
  const { getClosestPositionInImageBounds } = useImageClamping();

  const [showPotentialPoints, setShowPotentialPoints] = useState(true);
  const [vertices, setVertices, verticesHistory] = useStateWithHistory(
    [] as Polygon,
    500,
  );

  const latestVerticesHistory = useLatest(verticesHistory);
  const [validVertexHoveredIndex, setValidVertexHoveredIndex] = useState<
    number | null
  >(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });
  const polygonLinePoints = useMemo(() => vertices.flat(), [vertices]);
  const potentialLinePoints = useMemo(
    () =>
      [
        vertices[vertices.length - 1],
        [hoveredPosition.x / absoluteScale, hoveredPosition.y / absoluteScale],
      ].flat(),
    [vertices, hoveredPosition.x, hoveredPosition.y, absoluteScale],
  );

  const addVertex = useCallback(() => {
    const coords = getStagePointerCoordinatesSnappedToPixel(
      stage,
      absoluteScale,
      getClosestPositionInImageBounds(),
    );
    if (coords) {
      setVertices([
        ...vertices,
        [
          Math.round(coords.x / absoluteScale),
          Math.round(coords.y / absoluteScale),
        ],
      ]);
    }
  }, [
    stage,
    absoluteScale,
    getClosestPositionInImageBounds,
    setVertices,
    vertices,
  ]);

  const handleClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      addVertex();
    },
    [addVertex],
  );

  const resetData = useCallback(() => {
    latestVerticesHistory.current.go(0);
    latestVerticesHistory.current.history = [];
    setVertices([]);
  }, [latestVerticesHistory, setVertices]);

  const doSubmit = useCallback(() => {
    addLabels([
      {
        id: uuidv4(),
        classLabelId: activeClassLabelId ?? undefined,
        polygon: vertices,
        bbox: calculateBbox(vertices.flat()),
      },
    ]);
    resetData();
  }, [activeClassLabelId, vertices, resetData, addLabels]);

  useLayoutEffect(() => {
    if (prevImageId !== undefined && imageId !== prevImageId) resetData();
  }, [imageId, prevImageId, resetData]);

  const handleMouseMove = useCallback(() => {
    const coordinates = getStagePointerCoordinatesSnappedToPixel(
      stage,
      absoluteScale,
      getClosestPositionInImageBounds(),
    );
    if (coordinates) {
      setHoveredPosition(coordinates);
    }
  }, [absoluteScale, getClosestPositionInImageBounds, stage]);

  useEffect(() => {
    if (!panningEnabled) {
      stage.on('mousemove.polygonTool', () => {
        handleMouseMove();
      });
      stage.on('click.polygonTool', (e) => {
        if (!showPotentialPoints) {
          setShowPotentialPoints(true);
        }
        handleClick(e);
      });
    }

    return () => {
      stage.off('mousemove.polygonTool click.polygonTool');
    };
  }, [
    getClosestPositionInImageBounds,
    handleClick,
    handleMouseMove,
    panningEnabled,
    showPotentialPoints,
    stage,
  ]);

  const handleVertexClick = (
    i: number,
    e: KonvaEventObject<MouseEvent | Event>,
  ) => {
    // check if polygon is closeable (unless you're Kevin)
    // check if this is the first or the last Vertex
    if (shouldVertexClickClosePolygon(vertices, i)) {
      // do not generate a new Vertex by not bubbling the event to the layer click handler
      e.cancelBubble = true;
      doSubmit();
    }
  };

  const handleVertexMouseEnter = (i: number) => {
    if (shouldVertexClickClosePolygon(vertices, i)) {
      setValidVertexHoveredIndex(i);
    }
  };

  const handleVertexMouseLeave = useCallback(() => {
    setValidVertexHoveredIndex(null);
  }, []);

  usePolygonToolShortcuts({
    vertices,
    setVertices,
    verticesHistory,
    resetActiveTool,
    doSubmit,
    addVertex,
    undo,
    redo,
    canUndo,
    canRedo,
  });

  return (
    <HotkeysProvider initiallyActiveScopes={['polygon-tool']}>
      <Layer>
        <Rect width={width} height={height} />
        <CursorSetter cursor={panningEnabled ? 'grab' : 'edit'} />
        <StageScaleProvider>
          {(scale) => (
            <>
              {vertices.map((vertex, i) => (
                <Circle
                  data-testid={`unfinishedPolygonPoint-${i}`}
                  onClick={(e) => handleVertexClick(i, e)}
                  onMouseEnter={() => handleVertexMouseEnter(i)}
                  onMouseLeave={handleVertexMouseLeave}
                  x={vertex[0] * absoluteScale}
                  y={vertex[1] * absoluteScale}
                  key={i}
                  radius={5 / scale}
                  fill={
                    i === validVertexHoveredIndex
                      ? EDIT_FILL_COLOR
                      : POTENTIAL_LABEL_FILL_COLOR
                  }
                  stroke="white"
                  strokeWidth={2 / scale}
                />
              ))}
              {vertices.length > 0 && showPotentialPoints && (
                <Line
                  dash={[3 / scale, 3 / scale]}
                  points={potentialLinePoints.map((n) => n * absoluteScale)}
                  stroke={POTENTIAL_LABEL_STROKE_COLOR}
                  strokeWidth={1 / scale}
                />
              )}
              {vertices.length > 1 && (
                <Line
                  dash={[3 / scale, 3 / scale]}
                  points={polygonLinePoints.map((n) => n * absoluteScale)}
                  stroke={POTENTIAL_LABEL_STROKE_COLOR}
                  strokeWidth={1 / scale}
                />
              )}
            </>
          )}
        </StageScaleProvider>
        {showCrosshairs && !panningEnabled && <CursorCrosshair />}
      </Layer>
    </HotkeysProvider>
  );
};

export default PolygonTool;
