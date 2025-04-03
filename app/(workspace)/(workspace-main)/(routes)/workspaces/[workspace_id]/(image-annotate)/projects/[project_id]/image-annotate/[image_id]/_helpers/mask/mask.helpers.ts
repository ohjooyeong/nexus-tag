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

const prepareMask = (mask: ProcessedImageData) => {
  const originalWidth = mask.width;
  const maskData = mask.data;
  const minX = mask.bounds.minX;
  const maxX = mask.bounds.maxX;
  const minY = mask.bounds.minY;
  const maxY = mask.bounds.maxY;

  // 각 면에 1px의 "흰색" 테두리를 추가한 경계 크기
  const reducedWidth = maxX - minX + 3;
  const reducedHeight = maxY - minY + 3;

  // 축소된 마스크 (경계 크기)
  const resultData = new Uint8Array(reducedWidth * reducedHeight);

  // 내부 값을 순회하면서 "검은색" 점들만 결과 마스크로 복사
  for (let y = minY; y < maxY + 1; y++) {
    for (let x = minX; x < maxX + 1; x++) {
      if (maskData[y * originalWidth + x] === 1) {
        resultData[(y - minY + 1) * reducedWidth + (x - minX + 1)] = 1;
      }
    }
  }

  return {
    data: resultData,
    width: reducedWidth,
    height: reducedHeight,
    offset: { x: minX - 1, y: minY - 1 },
  };
};

const traceContours = (mask: ProcessedImageData) => {
  const preparedMask = prepareMask(mask);
  const contours = [];
  let labelCounter = 0;

  const width = preparedMask.width;
  const doubleWidth = width * 2;
  const height = preparedMask.height;
  const sourceData = preparedMask.data;
  const offsetX = preparedMask.offset.x;
  const offsetY = preparedMask.offset.y;

  // 처리된 픽셀을 추적하기 위한 레이블 행렬
  const labelMatrix = new Uint8Array(sourceData);

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

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const currentIndex = y * width + x;

      if (sourceData[currentIndex] === 1) {
        for (
          let traceOffset = -width;
          traceOffset < doubleWidth;
          traceOffset += doubleWidth
        ) {
          if (
            sourceData[currentIndex + traceOffset] === 0 &&
            labelMatrix[currentIndex + traceOffset] === 0
          ) {
            // 윤곽선 추적 필요
            labelCounter++; // 다음 윤곽선을 위한 레이블
            const isInnerContour = traceOffset === width;

            const contourPoints: Point[] = [];
            let direction = isInnerContour ? 2 : 6; // 시작 방향향
            let startDirection = direction; // 초기 방향 추적

            let currentPoint = { x: x, y: y };
            let previousPoint = currentPoint;
            const firstPoint = currentPoint;
            let secondPoint = null;
            let nextPoint = null;

            // 두 번째 구현과 일치하도록 내부 윤곽선의 첫 번째 점 추가
            if (isInnerContour) {
              contourPoints.push({
                x: firstPoint.x + 1 + offsetX,
                y: firstPoint.y + 1 + offsetY,
              });
            } else {
              contourPoints.push({
                x: firstPoint.x + offsetX,
                y: firstPoint.y + offsetY,
              });
            }

            // 윤곽선 추적
            while (true) {
              // 현재 점에 대한 레이블 표시
              labelMatrix[currentPoint.y * width + currentPoint.x] =
                labelCounter;

              // 시계 방향으로 현재 점 주변의 모든 이웃을 순회
              let foundNeighbor = false;
              for (let j = 0; j < 8; j++) {
                direction = (direction + 1) % 8;

                // 새로운 방향으로 다음 점 가져오기
                const dirVector = directions[direction];
                nextPoint = {
                  x: currentPoint.x + dirVector[0],
                  y: currentPoint.y + dirVector[1],
                };

                const nextIndex = nextPoint.y * width + nextPoint.x;
                if (sourceData[nextIndex] === 1) {
                  // 검은색 경계 픽셀
                  labelMatrix[nextIndex] = labelCounter; // 레이블 표시
                  foundNeighbor = true;
                  break;
                }

                labelMatrix[nextIndex] = -1; // 흰색 경계 픽셀 표시
                nextPoint = null;
              }

              if (!foundNeighbor) break; // (단일 점 윤곽선)

              // 방향을 기반으로 점 추가
              // 먼저, 중복 확인을 위한 오프셋이 있는 점을 추가하는 함수 생성
              const addPoint = (dx: number, dy: number) => {
                const newX = previousPoint.x + offsetX + dx;
                const newY = previousPoint.y + offsetY + dy;
                const lastPoint = contourPoints.length
                  ? contourPoints[contourPoints.length - 1]
                  : null;

                // 마지막 점과 중복되지 않는 경우에만 점 추가
                if (
                  !(lastPoint && lastPoint.x === newX && lastPoint.y === newY)
                ) {
                  contourPoints.push({ x: newX, y: newY });
                }
              };

              // 처리할 방향 계산
              let currDir =
                typeof startDirection === 'number' ? startDirection : direction;
              const dirs = [];

              // 90도 이상 회전하는 경우 중간 점들을 추가해야 함
              if ((startDirection - direction + 8) % 8 > 2) {
                while (currDir !== direction) {
                  dirs.push(currDir);
                  currDir = (currDir + 1) % 8;
                }
              }
              dirs.push(direction);

              // 각 방향을 처리하고 해당하는 점들을 추가
              dirs.forEach((dir) => {
                switch (dir) {
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
              });

              if (nextPoint === null) break;
              currentPoint = nextPoint;

              // 윤곽선이 완성되었는지 확인
              if (secondPoint) {
                if (
                  previousPoint.x === firstPoint.x &&
                  previousPoint.y === firstPoint.y &&
                  currentPoint.x === secondPoint.x &&
                  currentPoint.y === secondPoint.y
                ) {
                  break; // 원래 위치로 돌아왔을 때 윤곽선 생성 완료
                }
              } else {
                secondPoint = nextPoint;
              }

              previousPoint = currentPoint;
              startDirection = direction; // 다음 비교를 위해 현재 방향 저장
              direction = (direction + 4) % 8; // 다음 방향 (현재 방향에 대해 대칭)
            }

            // 단일 점 윤곽선 처리 및 윤곽선 닫기
            if (nextPoint === null) {
              // 두 번째 구현과 일치하도록 단일 점 주위에 상자 생성
              contourPoints.push({
                x: firstPoint.x + offsetX,
                y: firstPoint.y + offsetY,
              });
              contourPoints.push({
                x: firstPoint.x + 1 + offsetX,
                y: firstPoint.y + offsetY,
              });
              contourPoints.push({
                x: firstPoint.x + 1 + offsetX,
                y: firstPoint.y + 1 + offsetY,
              });
              contourPoints.push({
                x: firstPoint.x + offsetX,
                y: firstPoint.y + 1 + offsetY,
              });
              contourPoints.push({
                x: firstPoint.x + offsetX,
                y: firstPoint.y + offsetY,
              });
            }

            // 윤곽선을 목록에 추가
            contours.push({
              inner: isInnerContour,
              label: labelCounter,
              points: contourPoints,
            });
          }
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
    let lastPoint: [number, number] | [] = [];
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
