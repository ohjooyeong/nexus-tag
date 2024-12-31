import React from 'react';
import { ImageLabel } from '../_types/image-label';
import { LabelClass } from '../_types/label-class';
import { KonvaEventObject } from 'konva/lib/Node';

type LabelProps = {
  label: ImageLabel;
  labelClass?: LabelClass | null;
  onDragStart?: (e: KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<MouseEvent | TouchEvent>) => void;
};

const Label = ({}: LabelProps) => {
  return <div>Label</div>;
};

export default Label;
