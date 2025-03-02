import Konva from 'konva';

import loadImage from 'blueimp-load-image';

export const getClampedPosition = (
  stage: Konva.Stage,
  { x, y }: { x: number; y: number },
  imageData = { width: 1920, height: 1080 },
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

export const imageDataFromUrl = async (url: string) => {
  try {
    // 이미지 중에 이미지 회전이 제대로 되어있지 않는 경우가 있다.
    // 그래서 이미지 회전을 제대로 해주는 라이브러리를 사용했음.
    // orientation: 1 옵션을 주어서 이미지 회전을 제대로 해준다.
    const result = await loadImage(url, {
      canvas: true,
      crossOrigin: 'anonymous',
      orientation: 1,
    });

    return {
      imageData: imageDataFromImage(result.image),
      imageObject: result.image,
    };
  } catch (e) {
    throw new Error('Unable to load image.');
  }
};

export const imageDataFromImage = (image: any) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;

  if (!ctx) return;

  ctx.drawImage(image, 0, 0);

  return ctx.getImageData(0, 0, image.width, image.height);
};
