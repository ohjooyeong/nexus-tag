import Konva from 'konva';

import loadImage from 'blueimp-load-image';

// 이미지 크기 계산 함수
const calculateImageDimensions = (
  viewportWidth: number,
  viewportHeight: number,
  imageData: { width: number; height: number },
) => {
  const viewportRatio = viewportWidth / viewportHeight;
  const imageRatio = imageData.width / imageData.height;

  return viewportRatio > imageRatio
    ? [imageData.width * (viewportHeight / imageData.height), viewportHeight]
    : [viewportWidth, imageData.height * (viewportWidth / imageData.width)];
};

// 위치 제한 계산 함수
const calculatePositionLimits = (
  viewportWidth: number,
  viewportHeight: number,
  imageWidth: number,
  imageHeight: number,
  scale: { x: number; y: number },
) => {
  const ALLOWED_PAN_THRESHOLD = 25;
  const [offsetX, offsetY] = [
    (viewportWidth - imageWidth) / 2,
    (viewportHeight - imageHeight) / 2,
  ];

  return {
    minXY: ALLOWED_PAN_THRESHOLD,
    maxX:
      -viewportWidth * (scale.x - 1) +
      offsetX * 2 * scale.x -
      ALLOWED_PAN_THRESHOLD,
    maxY:
      -viewportHeight * (scale.y - 1) +
      offsetY * 2 * scale.y -
      ALLOWED_PAN_THRESHOLD,
  };
};

export const getClampedPosition = (
  stage: Konva.Stage,
  { x, y }: { x: number; y: number },
  imageData = { width: 1920, height: 1080 },
) => {
  const scale = stage.scale();
  if (scale === undefined) return { x, y };

  const viewportWidth = stage.width();
  const viewportHeight = stage.height();
  const viewportRatio = viewportWidth / viewportHeight;
  const imageRatio = imageData.width / imageData.height;

  const [imageWidth, imageHeight] = calculateImageDimensions(
    viewportWidth,
    viewportHeight,
    imageData,
  );

  const { minXY, maxX, maxY } = calculatePositionLimits(
    viewportWidth,
    viewportHeight,
    imageWidth,
    imageHeight,
    scale,
  );

  let newX = x;
  let newY = y;

  // 가로 위치 계산
  if (scale.x > viewportRatio / imageRatio) {
    newX = Math.min(Math.max(newX, maxX), minXY);
  } else {
    newX = (viewportWidth - imageWidth * scale.x) / 2;
  }

  // 세로 위치 계산
  if (scale.y > imageRatio / viewportRatio) {
    newY = Math.min(Math.max(newY, maxY), minXY);
  } else {
    newY = (viewportHeight - imageHeight * scale.y) / 2;
  }

  return { x: newX, y: newY };
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
