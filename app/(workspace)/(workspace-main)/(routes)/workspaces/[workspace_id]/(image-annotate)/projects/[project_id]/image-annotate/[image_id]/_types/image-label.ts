import { getBbox, getLabelType } from '../_utils/utils';
import { Bbox, Label, Mask, Polygon } from './types';

export enum LabelType {
  BBOX = 'BBOX',
  POLYGON = 'POLYGON',
  MASK = 'MASK',
}

export interface ApiLabel {
  id: string;
  client_id?: string;
  labelType: LabelType;
  data: {
    polygon: Label['polygon'];
    mask: Label['mask'];
    bbox: Label['bbox'];
  };
  dataItem: {
    id: string;
  };
  zIndex: number;
  createdAt: string;
  updatedAt: string;
}

const fromBackendLabel = ({
  data,
  updatedAt,
  createdAt,
  ...entry
}: ApiLabel) => ({
  updatedAt: updatedAt,
  createdAt: createdAt,
  polygon: data.polygon,
  mask: data.mask,
  bbox: getBbox(data.bbox, data.mask, data.polygon),
  type: getLabelType({ polygon: data.polygon, mask: data.mask }),
  ...entry,
});

export type ImageLabel = ReturnType<typeof fromBackendLabel>;
export type EnrichedImageLabel = ImageLabel & {
  imageData?: ImageData;
  imageDataId?: string;
};

export const imageLabelDataMapper = {
  fromBackend: fromBackendLabel,
};
