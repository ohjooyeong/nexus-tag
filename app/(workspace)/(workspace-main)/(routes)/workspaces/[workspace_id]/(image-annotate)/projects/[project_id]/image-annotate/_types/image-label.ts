import { getBbox, getLabelType } from '../_utils/utils';
import { Label } from './types';

export enum LabelType {
  Polygon = 'polygon',
  Bbox = 'bbox',
  Mask = 'mask',
}

export type ApiLabel = {
  updatedOn: string;
  createdOn: string;
  polygon: Label['polygon'];
  mask: Label['mask'];
  bbox: Label['bbox'];
};

const fromBackendLabel = ({
  updatedOn,
  createdOn,
  polygon,
  mask,
  bbox,
  ...entry
}: ApiLabel) => ({
  updatedOn: (updatedOn || createdOn) as string,
  createdOn,
  polygon,
  mask,
  type: getLabelType({ polygon, mask }),
  bbox: getBbox(bbox, mask, polygon),
  ...entry,
});

export type ImageLabel = ReturnType<typeof fromBackendLabel>;
export type EnrichedImageLabel = ImageLabel & {
  imageData?: ImageData;
  imageDataId?: number;
};

export const imageLabelDataMapper = {
  fromBackend: fromBackendLabel,
};
