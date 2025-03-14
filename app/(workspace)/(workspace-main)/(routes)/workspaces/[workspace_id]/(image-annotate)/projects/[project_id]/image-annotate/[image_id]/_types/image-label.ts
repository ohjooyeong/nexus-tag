import { getBbox, getLabelType } from '../_utils/utils';
import { Label } from './types';

export enum LabelType {
  BBOX = 'BBOX',
  POLYGON = 'POLYGON',
  MASK = 'MASK',
}

export interface ApiLabel {
  id: string;
  clientId: string | null;
  labelType: LabelType;
  classLabelId: string;
  polygon: Label['polygon'];
  mask: Label['mask'];
  bbox: Label['bbox'];
  dataItem: {
    id: string;
  };
  zIndex: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  borderData: string;
}

const fromBackendLabel = ({
  polygon,
  mask,
  bbox,
  updatedAt,
  createdAt,
  borderData,
  ...entry
}: ApiLabel) => ({
  ...entry,
  updatedAt: updatedAt,
  createdAt: createdAt,
  polygon: polygon,
  mask: mask,
  borderData: borderData,
  bbox: getBbox(bbox, mask, polygon),
  type: getLabelType({ polygon, mask }),
});

export type ImageLabel = ReturnType<typeof fromBackendLabel>;
export type EnrichedImageLabel = ImageLabel & {
  imageData?: ImageData;
  imageDataId?: string;
};

export const imageLabelDataMapper = {
  fromBackend: fromBackendLabel,
};
