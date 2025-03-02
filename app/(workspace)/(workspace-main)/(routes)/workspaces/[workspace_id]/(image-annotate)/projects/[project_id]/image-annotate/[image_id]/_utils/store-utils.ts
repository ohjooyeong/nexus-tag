export const getMaskOptimisationMultiplier = ([width, height]: [
  number,
  number,
]) => {
  const area = width * height;

  if (area < 800 * 800) {
    return 1;
  }

  if (area > 10000 * 10000) {
    return 0.1;
  }

  return 0.2;
};

const elementsPerColor = 4;
const opacityOffset = 3;
const FILLED_PIXEL_OPACITY_THRESHOLD = 100;

interface PixelData {
  data: Uint8ClampedArray;
  width: number;
}

interface PaintImageDataParams {
  imageData: ImageData;
  color: [number, number, number, number];
}

interface ScaleImageDataParams {
  imageData: ImageData;
  canvasFactory: (width: number, height: number) => HTMLCanvasElement;
  scale: number;
}

interface ImageDataBoundsParams {
  imageData: ImageData;
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

export const getImageDataBounds = ({
  imageData,
}: ImageDataBoundsParams): [number, number, number, number] | null => {
  const { width, height } = imageData;
  let empty = true;
  let maxX = 0;
  let minX = width;
  let maxY = 0;
  let minY = height;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (isPixelFilled(imageData, x, y)) {
        empty = false;
        if (y >= maxY) maxY = y;
        if (x >= maxX) maxX = x;
        if (y <= minY) minY = y;
        if (x <= minX) minX = x;
      }
    }
  }

  return empty ? null : [minX, minY, maxX + 1, maxY + 1];
};

export const getScaledImageData = (
  imageData: ImageData,
  scale: number,
): ImageData => {
  const scaledImageData = scaleImageData({
    imageData,
    scale,
    canvasFactory: (...dimensions: [number, number]) => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = dimensions;

      return canvas;
    },
  });

  return scaledImageData;
};
