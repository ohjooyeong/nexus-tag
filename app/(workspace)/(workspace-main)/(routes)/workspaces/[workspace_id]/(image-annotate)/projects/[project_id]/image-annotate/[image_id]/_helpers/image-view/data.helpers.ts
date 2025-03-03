/* eslint-disable @typescript-eslint/no-explicit-any */
import RBush from 'rbush';
import { ImageLabel } from '../../_types/image-label';

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
