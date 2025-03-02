/* eslint-disable @typescript-eslint/no-explicit-any */
import RBush from 'rbush';
import { ImageLabel } from '../../_types/image-label';

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
