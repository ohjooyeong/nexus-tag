import React, { useMemo } from 'react';
import { Line } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { ImageLabel } from '../../_types/image-label';
import { getBboxDimensions } from '../../_helpers/image-view/common.helpers';
import EditedPolygon from './edited-polygon';

type PolygonProps = {
  draggable: boolean;
  dragDistance: number;
  label: ImageLabel;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragStart?: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<MouseEvent>) => void;
  dragBoundFunc?: (pos: Konva.Vector2d) => Konva.Vector2d;
  fill: string;
  stroke: string;
  dash?: number[];
  strokeWidth?: number;
  onMouseOut: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseOver: (e: KonvaEventObject<MouseEvent>) => void;
  absoluteScale: number;
  edited: boolean;
  isDragged?: boolean;
};

const Polygon = ({
  label,
  draggable,
  dragDistance,
  onClick,

  onDragStart,
  onDragEnd,
  fill,
  stroke,
  dash,
  onMouseOver,
  onMouseOut,
  absoluteScale,
  dragBoundFunc,
  edited,
  isDragged,
}: PolygonProps) => {
  const { bbox } = label;
  const vertexes = useMemo(
    () =>
      label.polygon
        ?.flat()
        .map((x, i) => (x - (i % 2 ? bbox[1] : bbox[0])) * absoluteScale) || [],
    [absoluteScale, bbox, label.polygon],
  );

  const { width, height } = getBboxDimensions(bbox, absoluteScale);

  return edited ? (
    <EditedPolygon
      label={label}
      absoluteScale={absoluteScale}
      fill={fill}
      stroke={stroke}
      onDragStart={onDragStart}
      dragBoundFunc={dragBoundFunc}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      isDragged={isDragged}
    />
  ) : (
    <Line
      x={bbox[0] * absoluteScale}
      y={bbox[1] * absoluteScale}
      width={width}
      height={height}
      id={label.id}
      perfectDrawEnabled={false}
      closed
      draggable={draggable}
      dragDistance={dragDistance}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      points={vertexes}
      strokeScaleEnabled={false}
      shadowForStrokeEnabled={false}
      fill={fill}
      stroke={stroke}
      name="polygon"
      isDragged={isDragged}
      dash={dash}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      dragBoundFunc={dragBoundFunc}
    />
  );
};

export default Polygon;
