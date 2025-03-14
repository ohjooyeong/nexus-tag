import {
  generatePathData,
  getImageDataBounds,
  getPathImageData,
  hexToRGB,
  imageDataToRle,
  processAndPackage,
  processImageData,
  rleToImageData,
  traceAndSimplify,
} from '../../_helpers/mask/mask.helpers';
import { ImageLabel } from '../../_types/image-label';
import { CombinedLabel, ProcessedImageData } from '../../_types/types';
import { getHeight, getWidth } from '../../_utils/utils';

export const transformImageDataOpacity = (imageData: ImageData) => {
  for (let i = 0; i < imageData.data.length / 4; i += 1) {
    const j = i * 4;

    if (imageData.data[j + 3] >= 128) {
      imageData.data[j + 3] = 255;
    } else {
      imageData.data[j + 3] = 0;
    }
  }
};

const elementsPerColor = 4;

export const maskToImageData = (
  mask: ProcessedImageData,
  color = [255, 255, 255, 255],
) => {
  const { width, height, data } = mask;
  const array = new Uint8ClampedArray(width * height * elementsPerColor);
  for (let i = 0; i < data.length; i += 1) {
    const index = i * elementsPerColor;
    if (data[i] === 1) {
      [array[index], array[index + 1], array[index + 2], array[index + 3]] =
        color;
    }
  }

  return new ImageData(array, width, height);
};

interface ImageDataResult {
  maskData: ImageData | ProcessedImageData | null;
  borderData: string | null;
}

export const getImageDataFromLabel = async (
  label: ImageLabel,
  asImageData: boolean,
  withBorder: boolean,
): Promise<ImageDataResult | undefined> => {
  let imageData: ImageData;
  let result: [ProcessedImageData, ImageData] | null = null;
  let borderData: string | null = null;
  try {
    const context = {
      mask: label.mask,
      width: getWidth(label.bbox),
      height: getHeight(label.bbox),
      color: hexToRGB('#fff', 255),
    };
    imageData = rleToImageData(context);

    const processedResult = processAndPackage(
      getImageDataBounds(imageData),
      context.color,
    );
    result = processedResult as [ProcessedImageData, ImageData] | null;

    if (withBorder) {
      borderData = processImageData(imageData);
    }

    if (result) {
      return {
        maskData: result[asImageData ? 1 : 0],
        borderData: borderData,
      };
    }

    return {
      maskData: null,
      borderData: null,
    };
  } catch (error) {
    console.log(error);
  }
};

interface MaskSaveResult {
  bbox: [number, number, number, number];
  mask: number[];
  borderData: string | null;
}

export const getMaskToSave = async (
  imageData: ImageData,
): Promise<MaskSaveResult | null> => {
  try {
    transformImageDataOpacity(imageData);

    const result = processAndPackage(getImageDataBounds(imageData));
    if (!result) return null;
    const processedData = result[0] as ProcessedImageData;
    const { minX, minY, maxX, maxY } = processedData.bounds;
    const bbox = [minX, minY, maxX + 1, maxY + 1] as [
      number,
      number,
      number,
      number,
    ];

    const transMask = {
      imageData: result[1] as ImageData,
      bounds: bbox,
    };

    const rleData = imageDataToRle(transMask);
    const context = {
      mask: rleData.data,
      width: getWidth(bbox),
      height: getHeight(bbox),
      color: hexToRGB('#fff', 140),
    };

    const resultImageData = rleToImageData(context);
    const borderData = processImageData(resultImageData);

    return { bbox, mask: rleData.data, borderData };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getOuterAndInPathCotour = (boundsData: ProcessedImageData) => {
  const traceData = traceAndSimplify(boundsData),
    result = traceData.filter(({ inner: boundsData }) => !boundsData);
  return {
    outerContours: result,
    path: generatePathData(result),
    innerContourCount: traceData.length - result.length,
  };
};

interface Area {
  data?: string;
  bbox: number[];
}

interface ClosedMaskResult {
  maskData: ProcessedImageData;
  borderData: string | null;
}

export const getClosedMask = async (
  imageData: ImageData,
  combinedLabels: CombinedLabel[],
): Promise<ClosedMaskResult | null | undefined> => {
  let mask;
  let result;
  let newImageData;
  let closedContoursCount;
  transformImageDataOpacity(imageData);
  try {
    mask = getImageDataBounds(imageData);
    if (!mask) return null;

    // 외곽선 경로를 얻기 위해 워커를 실행하고, DOM 캔버스를 사용하여 이미지 데이터로 변환한 다음
    // 워커를 다시 실행하여 이미지 데이터에서 마스크 객체를 얻습니다
    const canvas = document.createElement('canvas');
    canvas.width = mask.width;
    canvas.height = mask.height;
    const { path, innerContourCount } = getOuterAndInPathCotour(mask);

    closedContoursCount = innerContourCount;
    if (path && closedContoursCount > 0) {
      newImageData = getPathImageData(canvas, path);
    }

    if (closedContoursCount > 0) {
      // 현재 라벨과 겹침이 있는 부분은 색칠 안되게 하기
      const offscreenCanvas = new OffscreenCanvas(1, 1);
      const context = offscreenCanvas.getContext('2d');
      offscreenCanvas.width = mask.width;
      offscreenCanvas.height = mask.height;

      if (!context) return null;

      if (newImageData) {
        context.putImageData(newImageData, 0, 0);
      }
      if (combinedLabels && combinedLabels.length > 0) {
        combinedLabels.forEach((area) => {
          if (area.data) {
            const path = new Path2D(area.data);
            context.globalCompositeOperation = 'destination-out';
            context.translate(area.bbox[0], area.bbox[1]);
            context.fill(path);
            context.setTransform(1, 0, 0, 1, 0, 0);
          }
        });
      }

      const finalImageData = context.getImageData(
        0,
        0,
        mask.width,
        mask.height,
      );

      result = processAndPackage(getImageDataBounds(finalImageData)) as [
        ProcessedImageData,
        ImageData,
      ];
      const borderData = processImageData(result[1]);

      return {
        maskData: result[0],
        borderData,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
