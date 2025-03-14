import MagicWand from 'magic-wand-tool';
import { Bbox, Label, ProcessedImageData } from '../../_types/types';

interface Point {
  x: number;
  y: number;
}

interface Contour {
  inner: boolean;
  label: number;
  points: Point[];
}

interface RleData {
  data: number[];
  width: number;
  height: number;
}

interface DrawingInput {
  currentValue: {
    borders: string | null;
    imageData: ImageData | null;
  };
  width: number;
  height: number;
  mouseMovement: {
    globalCompositeOperation: GlobalCompositeOperation;
    hex: string;
    lineWidth: number;
    points: [number, number][];
  } | null;
  excludedAreas: Array<{
    data: string | null;
    bbox: Bbox;
  }> | null;
}

interface TraceAndSimplifyOptions {
  tolerance?: number;
  count?: number;
}

export const assignColorToPixels = (
  inputImage: ProcessedImageData,
  newColor: [number, number, number, number] = [255, 255, 255, 255],
): ImageData => {
  const imageWidth = inputImage.width;
  const imageHeight = inputImage.height;
  const originalData = inputImage.data;
  const newImageDataArray = new Uint8ClampedArray(imageWidth * imageHeight * 4);

  for (let i = 0; i < originalData.length; i += 1) {
    const index = 4 * i;
    if (originalData[i] === 1) {
      newImageDataArray[index] = newColor[0];
      newImageDataArray[index + 1] = newColor[1];
      newImageDataArray[index + 2] = newColor[2];
      newImageDataArray[index + 3] = newColor[3];
    }
  }

  return new ImageData(newImageDataArray, imageWidth, imageHeight);
};

export const getImageDataBounds = (
  imageData: ImageData,
): ProcessedImageData | null => {
  const { width, height, data } = imageData;
  const binaryData = new Uint8Array(width * height);
  let hasPixel = false;
  let minX = width + 1,
    minY = height + 1,
    maxX = -1,
    maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (data[4 * index + 3] >= 100) {
        hasPixel = true;
        binaryData[index] = 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return hasPixel
    ? { data: binaryData, width, height, bounds: { minX, minY, maxX, maxY } }
    : null;
};

export const generatePathData = (contours: Contour[]): string | null => {
  let previousX: number, previousY: number;

  const pathData = contours
    .map((contour) => {
      return contour.points
        .map((point, index) => {
          const x = Math.round(point.x);
          const y = Math.round(point.y);

          const command = index === 0 ? 'M' : 'l';
          const deltaX = index === 0 ? x : x - previousX;
          const deltaY = index === 0 ? y : y - previousY;

          previousX = x;
          previousY = y;

          return `${command} ${Math.round(deltaX)},${Math.round(deltaY)}`;
        })
        .join(' ');
    })
    .join(' ');

  return pathData ? `${pathData} z` : null;
};

interface ContourImage {
  data: Uint8Array;
  width: number;
  height: number;
  offset: { x: number; y: number };
}

export const traceContours = (inputMask: ProcessedImageData) => {
  // Prepare mask data with padding
  const prepareImageData = (mask: ProcessedImageData) => {
    const { width, data, bounds } = mask;
    const { minX, maxX, minY, maxY } = bounds;

    const paddedWidth = maxX - minX + 3;
    const paddedHeight = maxY - minY + 3;
    const paddedData = new Uint8Array(paddedWidth * paddedHeight);

    for (let y = minY; y < maxY + 1; y++) {
      for (let x = minX; x < maxX + 1; x++) {
        if (data[y * width + x] === 1) {
          paddedData[(y - minY + 1) * paddedWidth + (x - minX + 1)] = 1;
        }
      }
    }

    return {
      data: paddedData,
      width: paddedWidth,
      height: paddedHeight,
      offset: { x: minX - 1, y: minY - 1 },
    };
  };

  const paddedMask = prepareImageData(inputMask);
  const contours = [];
  let contourCount = 0;

  const {
    width: maskWidth,
    height: maskHeight,
    data: maskData,
    offset,
  } = paddedMask;
  const doubleWidth = 2 * maskWidth;
  const visitedPixels = new Uint8Array(maskData);

  // Direction vectors for 8-connected neighborhood
  const directions = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  // Function to add point to contour
  const addPointToContour = (
    contourPoints: any[],
    currentX: number,
    currentY: number,
    dirIndex: number,
  ) => {
    const addPoint = (dx: number, dy: number) => {
      const x = currentX + offset.x + dx;
      const y = currentY + offset.y + dy;
      const lastPoint = contourPoints[contourPoints.length - 1];

      if (!lastPoint || lastPoint.x !== x || lastPoint.y !== y) {
        contourPoints.push({ x, y });
      }
    };

    switch (dirIndex) {
      case 0:
        addPoint(1, 0);
        break;
      case 1:
        addPoint(1, 0);
        addPoint(1, 1);
        break;
      case 2:
        addPoint(1, 1);
        break;
      case 3:
        addPoint(1, 1);
        addPoint(0, 1);
        break;
      case 4:
        addPoint(0, 1);
        break;
      case 5:
        addPoint(0, 1);
        addPoint(0, 0);
        break;
      case 6:
        addPoint(0, 0);
        break;
      case 7:
        addPoint(0, 0);
        addPoint(1, 0);
        break;
    }
  };

  // Trace contours
  const traceContour = (
    startX: number,
    startY: number,
    isInnerContour: boolean,
    maskWidth: number,
    maskData: Uint8Array,
    visitedPixels: Uint8Array,
    offset: { x: number; y: number },
    directions: number[][],
    contourCount: number,
  ): { points: Point[]; completed: boolean } => {
    const contourPoints: Point[] = [];
    const startPos = { x: startX, y: startY };
    let currentPos = { x: startX, y: startY };
    let firstPoint = null;
    let prevDir = isInnerContour ? 2 : 6;
    let currentDir = prevDir;

    // 시작점 추가
    contourPoints.push({
      x: startPos.x + (isInnerContour ? 1 : 0) + offset.x,
      y: startPos.y + (isInnerContour ? 1 : 0) + offset.y,
    });

    while (true) {
      visitedPixels[currentPos.y * maskWidth + currentPos.x] = contourCount;

      // 다음 위치 찾기
      let foundNextPos = false;
      let nextPos = { x: currentPos.x, y: currentPos.y };

      for (let i = 0; i < 8; i++) {
        currentDir = (currentDir + 1) % 8;
        const [dx, dy] = directions[currentDir];
        const newPos = { x: currentPos.x + dx, y: currentPos.y + dy };
        const newIndex = newPos.y * maskWidth + newPos.x;

        if (maskData[newIndex] === 1) {
          visitedPixels[newIndex] = contourCount;
          nextPos = newPos;
          foundNextPos = true;
          break;
        }
        visitedPixels[newIndex] = -1;
      }

      if (!foundNextPos) {
        return { points: contourPoints, completed: false };
      }

      if (firstPoint) {
        if (
          currentPos.x === startPos.x &&
          currentPos.y === startPos.y &&
          nextPos.x === firstPoint.x &&
          nextPos.y === firstPoint.y
        ) {
          return { points: contourPoints, completed: true };
        }
      } else {
        firstPoint = { ...nextPos };
      }

      // Add points to contour
      const dirRange = [];
      if ((prevDir - currentDir + 8) % 8 > 2) {
        let dir = prevDir;
        while (dir !== currentDir) {
          dirRange.push(dir);
          dir = (dir + 1) % 8;
        }
      }
      dirRange.push(currentDir);

      dirRange.forEach((dir) => {
        addPointToContour(contourPoints, currentPos.x, currentPos.y, dir);
      });

      currentPos = nextPos;
      prevDir = currentDir;
      currentDir = (currentDir + 4) % 8;
    }
  };

  // Trace contours 함수 내부 수정
  for (let y = 1; y < maskHeight - 1; y++) {
    for (let x = 1; x < maskWidth - 1; x++) {
      const pixelIndex = y * maskWidth + x;

      if (maskData[pixelIndex] !== 1) continue;

      for (const yOffset of [-maskWidth, maskWidth]) {
        const neighborIndex = pixelIndex + yOffset;
        if (
          maskData[neighborIndex] === 0 &&
          visitedPixels[neighborIndex] === 0
        ) {
          contourCount++;
          const isInnerContour = yOffset === -maskWidth;

          const { points, completed } = traceContour(
            x,
            y,
            isInnerContour,
            maskWidth,
            maskData,
            visitedPixels,
            offset,
            directions,
            contourCount,
          );

          if (!completed) {
            // 닫히지 않은 컨투어 처리
            const closePoints = [
              { x: x + offset.x, y: y + offset.y },
              { x: x + 1 + offset.x, y: y + offset.y },
              { x: x + 1 + offset.x, y: y + 1 + offset.y },
              { x: x + offset.x, y: y + 1 + offset.y },
              { x: x + offset.x, y: y + offset.y },
            ];
            points.push(...closePoints);
          }

          contours.push({
            inner: isInnerContour,
            label: contourCount,
            points,
          });
        }
      }
    }
  }

  return contours;
};

export const processAndPackage = (
  input: ProcessedImageData | null,
  color: [number, number, number, number] = hexToRGB('#fff', 255),
): [ProcessedImageData, ImageData] | null => {
  return input ? [input, assignColorToPixels(input, color)] : null;
};

export function traceAndSimplify(
  imageData: ProcessedImageData,
  options: TraceAndSimplifyOptions = {},
): Contour[] {
  const tolerance = options.tolerance || 0;
  const count = options.count || 100;

  const tracedContours = traceContours(imageData);

  return MagicWand.simplifyContours(tracedContours, tolerance, count);
}

export const processImageData = (imageData: ImageData): string | null => {
  const preprocessedData = getImageDataBounds(imageData);
  return preprocessedData
    ? generatePathData(traceAndSimplify(preprocessedData))
    : null;
};

export const hexToRGB = (
  hex: string,
  alpha?: number,
): [number, number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = parseInt(hex.slice(7, 9), 16);

  return alpha !== undefined ? [r, g, b, alpha] : [r, g, b, a];
};

interface RleToImageDataInput {
  mask: Label['mask'];
  width: number;
  height: number;
  color: [number, number, number, number];
}

export const rleToImageData = (input: RleToImageDataInput): ImageData => {
  const rleData = input.mask;
  const width = input.width;
  const height = input.height;
  const color = input.color;
  const imageData = new ImageData(width, height);

  if (!rleData) return imageData;

  for (let i = 0; i < rleData.length; i += 2) {
    const startingIndex = rleData[i] - 1;
    const runLength = rleData[i + 1];

    for (let j = 0; j < runLength; j++) {
      const position = startingIndex + j;
      const row = Math.floor(position / width);
      const col = position % width;
      const pixelIndex = 4 * (row * width + col);

      imageData.data[pixelIndex] = color[0];
      imageData.data[pixelIndex + 1] = color[1];
      imageData.data[pixelIndex + 2] = color[2];
      imageData.data[pixelIndex + 3] = color[3];
    }
  }

  return imageData;
};

export const imageDataToRle = (input: {
  imageData: ImageData;
  bounds?: [number, number, number, number];
}): RleData => {
  const { imageData, bounds = [0, 0, imageData.width, imageData.height] } =
    input;
  const width = bounds[2] - bounds[0];
  const height = bounds[3] - bounds[1];
  const area = width * height;
  const rleData: number[] = [];
  let runLength = 0;
  let startingIndex = 0;

  const getPixelIndex = (position: number): number => {
    const row = bounds[1] + Math.floor(position / width);
    const col = bounds[0] + (position % width);
    return 4 * (row * imageData.width + col);
  };

  for (let position = 0; position < area + 1; position += 1) {
    if (position < area && imageData.data[getPixelIndex(position) + 3] > 0) {
      if (runLength === 0) {
        startingIndex = position + 1;
      }
      runLength += 1;
    } else if (runLength > 0) {
      rleData.push(startingIndex, runLength);
      runLength = 0;
    }
  }

  return { data: rleData, width, height };
};

export const getPathImageData = (
  canvas: HTMLCanvasElement | OffscreenCanvas,
  path: string,
): ImageData | undefined => {
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (
      ctx instanceof CanvasRenderingContext2D ||
      ctx instanceof OffscreenCanvasRenderingContext2D
    ) {
      ctx.fillStyle = '#ffffff';
      ctx.fill(new Path2D(path));
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }
  return undefined;
};

/**
 * 오프스크린 캔버스에서 그리기 작업을 처리하는 함수
 * @param currentValue - 현재 캔버스 상태 (테두리 및 이미지 데이터 포함)
 * @param width - 캔버스 너비
 * @param height - 캔버스 높이
 * @param mouseMovement - 마우스 이동 데이터
 * @param excludedAreas - 제외할 영역 정보
 * @returns 최종 이미지 데이터와 테두리 경로를 포함하는 객체
 */
export const drawingOffScreen = async ({
  currentValue,
  width,
  height,
  mouseMovement,
  excludedAreas,
}: DrawingInput): Promise<{
  imageData: ImageData;
  borders: string | null;
}> => {
  // 오프스크린 캔버스 생성
  const offscreenCanvas = new OffscreenCanvas(width, height);
  const context = offscreenCanvas.getContext('2d');
  if (!context) throw new Error('Failed to get canvas context');

  // 마우스 이동에 따른 그리기 처리
  if (mouseMovement) {
    // 그리기 관련 매개변수 추출
    const { globalCompositeOperation, hex, lineWidth, points } = mouseMovement;
    context.globalCompositeOperation = globalCompositeOperation;
    context.strokeStyle = hex;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // 제외 영역이 없고 이전 이미지 데이터가 있는 경우 복원
    if (currentValue.imageData && !excludedAreas) {
      context.putImageData(currentValue.imageData, 0, 0);
    }

    // 포인트들을 연결하여 선 그리기
    let lastPoint: [number, number] = [0, 0];
    points.forEach(([x, y]) => {
      const [prevX = x, prevY = y] = lastPoint;
      // 선 굵기가 홀수/짝수인 경우에 따라 좌표 조정
      if (lineWidth % 2) {
        context.moveTo(prevX + 0.5, prevY + 0.5);
        context.lineTo(x + 0.5, y + 0.5);
      } else {
        context.moveTo(prevX, prevY);
        context.lineTo(x, y);
      }
      lastPoint = [x, y];
    });
    context.stroke();
    context.closePath();
  }

  // 제외 영역 처리
  if (excludedAreas) {
    excludedAreas.forEach((area) => {
      if (area.data) {
        // 복잡한 형태의 경로 생성 및 채우기
        const path = new Path2D(area.data);
        context.globalCompositeOperation = 'destination-out';
        context.translate(area.bbox[0], area.bbox[1]);
        context.fill(path);
        context.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        // 직사각형 영역 지우기
        const [x1, y1, x2, y2] = area.bbox;
        context.clearRect(x1, y1, x2 - x1, y2 - y1);
      }

      // 테두리가 있는 경우 다시 그리기
      if (currentValue.borders && mouseMovement) {
        const path = new Path2D(currentValue.borders);
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = mouseMovement.hex;
        context.fill(path);
      }
    });
  }

  // 최종 이미지 데이터 가져오기
  const finalImageData = context.getImageData(0, 0, width, height);

  // 알파값을 완전 투명 또는 완전 불투명으로 정규화
  for (let i = 0; i < finalImageData.data.length / 4; i++) {
    const index = 4 * i;
    finalImageData.data[index + 3] =
      finalImageData.data[index + 3] >= 128 ? 255 : 0;
  }

  // 이미지 데이터를 처리하여 테두리 경로 생성
  const borderResult = processImageData(finalImageData);

  return {
    imageData: finalImageData,
    borders: borderResult,
  };
};
