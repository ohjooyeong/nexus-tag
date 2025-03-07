import { Vector2d } from 'konva/lib/types';
import { Stage } from 'konva/lib/Stage';
import { Bbox } from '../../_types/types';

export const getBboxDimensions = (bbox: Bbox, scale?: number) => ({
  width: (bbox[2] - bbox[0]) * (scale || 1),
  height: (bbox[3] - bbox[1]) * (scale || 1),
});

export const snapToPixel = (coordinate: number, absoluteScale: number) =>
  Math.round(coordinate / absoluteScale) * absoluteScale;

export const getStagePointerCoordinates = (
  stage: Stage,
  pointerPosition?: Vector2d,
) => {
  const pointer = pointerPosition || stage?.getPointerPosition();
  if (pointer) {
    const stageX = stage.x();
    const stageY = stage.y();
    const stageScaleX = stage.scaleX();
    const stageScaleY = stage.scaleY();
    const x = (pointer.x - stageX) / stageScaleX;
    const y = (pointer.y - stageY) / stageScaleY;

    return { x, y };
  }

  return null;
};

export const roundPositionToPixel = (
  p: { x: number; y: number },
  absoluteScale: number,
) => ({
  x: snapToPixel(p.x, absoluteScale),
  y: snapToPixel(p.y, absoluteScale),
});

export const getStagePointerCoordinatesSnappedToPixel = (
  stage: Stage,
  absoluteScale: number,
  pointerPosition?: Vector2d,
) => {
  const coordinates = getStagePointerCoordinates(stage, pointerPosition);
  if (coordinates) {
    return {
      x: snapToPixel(coordinates.x, absoluteScale),
      y: snapToPixel(coordinates.y, absoluteScale),
    };
  }

  return null;
};

export const getPointerTopLeftCoordinates = (stage: Stage) => {
  const containerRect = stage.container().getBoundingClientRect();

  const pointerPosition = stage.getPointerPosition();
  if (!pointerPosition) {
    return {
      left: 0,
      top: 0,
    };
  }

  return {
    left: containerRect.left + pointerPosition.x,
    top: containerRect.top + pointerPosition.y,
  };
};
