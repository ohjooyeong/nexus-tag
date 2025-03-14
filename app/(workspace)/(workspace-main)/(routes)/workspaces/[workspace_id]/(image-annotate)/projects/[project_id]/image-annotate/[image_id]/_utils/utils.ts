import { LabelType } from '../_types/image-label';
import { Bbox, CombinedLabel, Label, ShapeRect } from '../_types/types';

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

const haveIntersection = (r1?: ShapeRect, r2?: ShapeRect) => {
  if (!r1 || !r2) return false;

  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
};
const transformBbox = ([x1, y1, x2, y2]: number[]) => ({
  x: x1,
  y: y1,
  width: x2 - x1,
  height: y2 - y1,
});

const offsetHalf = (coords: number) => coords + 0.5;

export const excludeShapes = ({
  combinedLabels,
  context,
  shouldIntersect,
  cursorBox,
}: {
  combinedLabels: CombinedLabel[];
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  shouldIntersect?: boolean;
  cursorBox?: ShapeRect;
}) => {
  const intersectedLabels = combinedLabels.filter((label) =>
    shouldIntersect
      ? haveIntersection(cursorBox, transformBbox(label.bbox))
      : true,
  );

  intersectedLabels.forEach((label) => {
    if (label.data) {
      const shape = new Path2D(label.data);

      context.globalCompositeOperation = 'destination-out';
      context.translate(label.bbox[0], label.bbox[1]);
      context.fill(shape);
      context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      const rect = transformBbox(label.bbox);

      context.clearRect(rect.x, rect.y, rect.width, rect.height);
    }
  });
};

export const renderStrokes = ({
  brushSize,
  context,
  lastX,
  lastY,
  x,
  y,
}: {
  brushSize: number;
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  lastX: number;
  lastY: number;
  x: number;
  y: number;
}) => {
  context.beginPath();

  context.lineWidth = brushSize;
  context.lineCap = 'round';
  context.lineJoin = 'round';

  if (brushSize % 2) {
    context.moveTo(offsetHalf(lastX), offsetHalf(lastY));
    context.lineTo(offsetHalf(x), offsetHalf(y));
  } else {
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
  }
  context.stroke();
  context.closePath();
};

/**
 * 폴리곤 포인트를 SVG 경로 문자열로 변환하는 함수
 * @param points - 폴리곤의 점들의 배열
 * @param bbox - 경계 상자 좌표
 * @returns SVG 경로 문자열 또는 null
 */
export const convertPolygonToSVGPath = (
  points: [number, number][] | null,
  bbox: [number, number, number, number],
): string | null =>
  points
    ? points.reduce((acc: string, val: [number, number], i: number) => {
        let res = acc;
        if (i === 0) {
          res += `M ${val[0] - bbox[0]},${val[1] - bbox[1]} `;
        } else {
          res += `l ${val[0] - (points[i - 1]?.[0] || 0)},${val[1] - (points[i - 1]?.[1] || 0)} `;
        }

        if (i === points.length - 1) {
          res += 'z';
        }

        return res;
      }, '')
    : null;

interface PaintImageDataParams {
  imageData: ImageData;
  color: [number, number, number, number];
}

interface ScaleImageDataParams {
  imageData: ImageData;
  canvasFactory: (width: number, height: number) => HTMLCanvasElement;
  scale: number;
}

const elementsPerColor = 4;
const opacityOffset = 3;
const FILLED_PIXEL_OPACITY_THRESHOLD = 100;

interface PixelData {
  data: Uint8ClampedArray;
  width: number;
}

export const isPixelFilled = (
  { data, width }: PixelData,
  x: number,
  y: number,
): boolean =>
  data[(y * width + x) * elementsPerColor + opacityOffset] >=
  FILLED_PIXEL_OPACITY_THRESHOLD;

export const paintImageData = ({
  imageData,
  color,
}: PaintImageDataParams): ImageData => {
  const { width, height } = imageData;
  const newData = new Uint8ClampedArray(imageData.data.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (isPixelFilled(imageData, x, y)) {
        const offset = (y * width + x) * elementsPerColor;

        [
          newData[offset],
          newData[offset + 1],
          newData[offset + 2],
          newData[offset + 3],
        ] = color;
      }
    }
  }

  return new ImageData(newData, width, height);
};

export const scaleImageData = ({
  imageData,
  canvasFactory,
  scale,
}: ScaleImageDataParams): ImageData => {
  const srcCanvas = canvasFactory(imageData.width, imageData.height);
  const destCanvas = canvasFactory(
    Math.floor(imageData.width * scale),
    Math.floor(imageData.height * scale),
  );

  const srcCtx = srcCanvas.getContext('2d');
  const destCtx = destCanvas.getContext('2d');

  if (!srcCtx || !destCtx) {
    throw new Error('Failed to get canvas context');
  }

  srcCtx.putImageData(imageData, 0, 0);

  destCtx.scale(scale, scale);
  destCtx.drawImage(srcCanvas, 0, 0);

  const scaledImageData = destCtx.getImageData(
    0,
    0,
    destCanvas.width,
    destCanvas.height,
  );
  if (!scaledImageData) {
    throw new Error('Failed to get image data from scaled canvas');
  }

  return scaledImageData;
};
