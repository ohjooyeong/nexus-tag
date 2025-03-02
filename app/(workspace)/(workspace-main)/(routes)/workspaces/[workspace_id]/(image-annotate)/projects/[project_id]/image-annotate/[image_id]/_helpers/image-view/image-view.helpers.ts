import Konva from 'konva';
import { retrieveImageDataWithFallback } from './data.helpers';

export const getClampedPosition = (
  stage: Konva.Stage,
  { x, y }: { x: number; y: number },
) => {
  let newX = x;
  let newY = y;

  const scale = stage.scale();

  if (scale === undefined) return { x: newX, y: newY };

  // Width of visible area
  const viewportWidth = stage.width();
  // Height of visible area
  const viewportHeight = stage.height();

  const viewportRatio = viewportWidth / viewportHeight;
  const imageData = retrieveImageDataWithFallback();
  const imageRatio = imageData.width / imageData.height;

  const [imageWidth, imageHeight] =
    viewportRatio > imageRatio
      ? [imageData.width * (viewportHeight / imageData.height), viewportHeight]
      : [viewportWidth, imageData.height * (viewportWidth / imageData.width)];

  // Empty gap from top and left.
  // E.g: For horizontal image -> offsetX === 0 && offsetY > 0
  //      For vertical image -> offsetY === 0 && offsetX > 0
  const [offsetX, offsetY] = [
    (viewportWidth - imageWidth) / 2,
    (viewportHeight - imageHeight) / 2,
  ];

  // Amount of allowed pixels to go outside
  const ALLOWED_PAN_THRESHOLD = 25;

  // Amount of allowed pixels to go outside from left and top
  const minXY = ALLOWED_PAN_THRESHOLD;

  // End point of horizontal drag/scroll
  const maxX =
    -viewportWidth * (scale.x - 1) +
    offsetX * 2 * scale.x -
    ALLOWED_PAN_THRESHOLD;

  // End point of vertical drag/scroll
  const maxY =
    -viewportHeight * (scale.y - 1) +
    offsetY * 2 * scale.y -
    ALLOWED_PAN_THRESHOLD;

  // If horizontally zoomed in enough and there's
  // a space from left and right to pan, apply
  // the position but keep it within the limit
  if (scale.x > viewportRatio / imageRatio) {
    // Restrict panning if it goes to far from the left (left of the image)
    if (newX > minXY) {
      newX = minXY;
    } else if (newX < maxX) {
      // Restrict panning if it goes to far from the right (right of the image)
      newX = maxX;
    }
  } else {
    // If horizontally wasn't zoomed in enough to pan,
    // keep it in the center horizontally
    newX = (viewportWidth - imageWidth * scale.x) / 2;
  }

  // If vertically zoomed in enough and there's
  // a space from top and bottom to pan, apply
  // the position but keep it within the limit
  if (scale.y > imageRatio / viewportRatio) {
    // Restrict panning if it goes to far from the top (start of the image)
    if (newY > minXY) {
      newY = minXY;
    } else if (newY < maxY) {
      // Restrict panning if it goes to far from the bottom (end of the image)
      newY = maxY;
    }
  } else {
    // If vertically wasn't zoomed in enough to pan,
    // keep it in the middle vertically
    newY = (viewportHeight - imageHeight * scale.y) / 2;
  }

  return {
    x: newX,
    y: newY,
  };
};
