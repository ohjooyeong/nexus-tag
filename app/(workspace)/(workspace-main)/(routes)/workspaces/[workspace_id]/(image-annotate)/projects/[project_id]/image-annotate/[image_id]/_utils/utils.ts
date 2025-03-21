import { LabelType } from '../_types/image-label';
import { Bbox, Label } from '../_types/types';

export const getWidth = ([x1, , x2]: Bbox) => x2 - x1;

export const getHeight = ([, y1, , y2]: Bbox) => y2 - y1;

export const getLabelType = ({
  polygon,
  mask,
}: {
  polygon: number[] | [number, number][] | null;
  mask: Label['mask'];
}) => {
  if (mask) return LabelType.MASK;

  return polygon ? LabelType.POLYGON : LabelType.BBOX;
};

export const calculateBbox = (points: number[], returnStrictBbox?: boolean) => {
  const yValues = points.filter((e, i) => i % 2);
  const xValues = points.filter((e, i) => !(i % 2));
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  if (returnStrictBbox)
    return [
      xMin,
      yMin,
      xMin === xMax ? xMax + 1 : xMax,
      yMin === yMax ? yMax + 1 : yMax,
    ] as Bbox;

  return [xMin, yMin, xMax, yMax] as Bbox;
};

export const getBbox = (
  bbox: Label['bbox'],
  mask: Label['mask'],
  polygon: Label['polygon'],
): Bbox => {
  if (bbox) {
    return bbox;
  }

  if (mask) {
    return calculateBbox(mask);
  }

  if (polygon) {
    return calculateBbox(polygon.flat());
  }

  return [0, 0, 0, 0];
};
