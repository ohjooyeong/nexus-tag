import chroma from 'chroma-js';
import {
  DEFAULT_LABEL_COLOR,
  DEFAULT_LABEL_STROKE,
  EDIT_STROKE_COLOR,
  RED_PINK,
  WHITE,
} from '../_constants/colors';
import {
  BORDER_OPACITY_HIGH_OVERRIDE,
  BORDER_OPACITY_LOW_OVERRIDE,
  FILL_OPACITY_THRESHOLD,
  HOVER_OPACITY_OVERRIDE,
} from '../_constants/constants';
import {
  adaptColorWithOpacity,
  getColorWithContrastingOpacityOverride,
  isColorOpacityAboveThreshold,
} from '../_helpers/colors/colors.helpers';

export const getColors = ({
  selected,
  hovered,
  color,
  isFilled,
}: {
  selected: boolean;
  hovered: boolean;
  color?: string | null;
  isFilled: boolean;
}) => {
  let fill = isFilled ? DEFAULT_LABEL_COLOR : `${DEFAULT_LABEL_COLOR}55`;

  let stroke = DEFAULT_LABEL_STROKE;

  let dash;
  let strokeWidth = 1;
  if (hovered && !selected) {
    stroke = RED_PINK;
  }
  if (color) {
    const hoverColor = adaptColorWithOpacity(color, HOVER_OPACITY_OVERRIDE);

    fill = hovered && !selected ? hoverColor : color;

    stroke = getColorWithContrastingOpacityOverride(
      fill,
      FILL_OPACITY_THRESHOLD,
      BORDER_OPACITY_LOW_OVERRIDE,
      BORDER_OPACITY_HIGH_OVERRIDE,
    );

    if (isFilled) {
      stroke = WHITE;
      fill = chroma(color).alpha(1).hex();
    }

    if (!isColorOpacityAboveThreshold(color, FILL_OPACITY_THRESHOLD)) {
      strokeWidth = 2;
    }
  }

  if (selected) {
    stroke = EDIT_STROKE_COLOR;
  }

  return { fill, stroke, dash, strokeWidth };
};
