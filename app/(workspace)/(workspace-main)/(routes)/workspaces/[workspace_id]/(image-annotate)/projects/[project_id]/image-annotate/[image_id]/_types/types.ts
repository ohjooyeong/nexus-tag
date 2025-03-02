export type Bbox = [number, number, number, number];
export type Mask = number[];
export type Point = [number, number];
export type Polygon = Point[];

export type Label = {
  bbox: Bbox | null;
  mask: Mask | null;
  polygon: Polygon | null;
};
