/* eslint-disable @typescript-eslint/no-explicit-any */
import RBush from 'rbush';
import { ImageLabel } from '../../[image_id]/_types/image-label';

declare global {
  interface Window {
    imageData: ImageData[] | null[];
    objectStorage: any[];
  }
}

window.imageData = [null, null];
// add first element, so no stored element will get a 0 index – and bool coercion comparison could be
// performed with ids safely
window.objectStorage = [null];

const compareLabelsPosition = (a: ImageLabel, b: ImageLabel, index: 0 | 1) =>
  a.bbox[index] - b.bbox[index];

export class MyRBush extends RBush<ImageLabel> {
  toBBox(label: ImageLabel) {
    const { bbox } = label;

    return { minX: bbox[0], minY: bbox[1], maxX: bbox[2], maxY: bbox[3] };
  }

  compareMinX(a: ImageLabel, b: ImageLabel) {
    return compareLabelsPosition(a, b, 0);
  }

  compareMinY(a: ImageLabel, b: ImageLabel) {
    return compareLabelsPosition(a, b, 1);
  }
}

const IMAGE_DATA_FALLBACK_VALUE = { width: 1, height: 1 };

export const retrieveImageData = (i = 0) => {
  if (!window.imageData || !Array.isArray(window.imageData)) {
    console.error('window.imageData is not defined or not an array.');
    return null;
  }
  return window.imageData[i] || null;
};

export const retrieveImageDataWithFallback = (i = 0) => {
  const data = retrieveImageData(i) || IMAGE_DATA_FALLBACK_VALUE;

  return { width: data.width, height: data.height };
};

export const retrieveObject = (id: number | null) => {
  if (id !== null) {
    return window.objectStorage[id];
  }
};

export const saveImageData = (data: any, i = 0) => {
  window.imageData[i] = data;
};

export const storeObject = (obj: any) => {
  const id = window.objectStorage.length;
  window.objectStorage.push(obj);

  return id;
};

export const clearObjectStorage = () => {
  window.objectStorage.forEach((_: any, index: number) => releaseObject(index));
  window.imageData = [null, null];
  window.objectStorage.splice(1, window.objectStorage.length - 1);
};

export const releaseObject = (id: number | null) => {
  if (id !== null) {
    window.objectStorage[id] = undefined;
  }
};
