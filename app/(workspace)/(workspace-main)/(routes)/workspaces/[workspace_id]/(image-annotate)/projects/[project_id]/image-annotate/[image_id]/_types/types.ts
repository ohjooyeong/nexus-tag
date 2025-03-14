import { Shape } from 'konva/lib/Shape';

export type Bbox = [number, number, number, number];
export type Mask = number[];
export type Point = [number, number];
export type Polygon = Point[];

export type Label = {
  bbox: Bbox | null;
  mask: Mask | null;
  polygon: Polygon | null;
};

export type ShapeRect = ReturnType<Shape['getClientRect']>;

export type CombinedLabel = {
  data: string | null;
  bbox: Bbox;
  id: string;
};

export enum Tool {
  Selection = 'selection',
  Pan = 'pan',
  Mask = 'mask',
  Bbox = 'bbox',
  Polygon = 'polygon',
}

export interface ImageBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ProcessedImageData {
  data: Uint8Array;
  width: number;
  height: number;
  bounds: ImageBounds;
}
