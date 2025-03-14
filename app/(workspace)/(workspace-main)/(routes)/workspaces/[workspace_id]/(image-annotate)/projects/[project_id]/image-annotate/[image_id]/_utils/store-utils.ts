import { scaleImageData } from './utils';

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
