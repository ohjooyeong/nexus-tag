import { WHITE } from './colors';

export const STAGE_INTERNAL_PADDING = 30;

// Zoom 관련 상수
export const ZOOM_SPEED = 0.15;
export const ZOOM_IN_MAX_VALUE = 600;

// 색 관련 상수
export const BBOX_FILL_COLOR = '#2E6FF2';
export const BBOX_STROKE_COLOR = WHITE;
export const DEFAULT_OPACITY = 0.3;
export const EDIT_FILL_COLOR = '#FF0000';
export const POTENTIAL_LABEL_FILL_COLOR = '#ffa500';
export const POTENTIAL_LABEL_FILL_COLOR_WITH_OPACITY = `${POTENTIAL_LABEL_FILL_COLOR}55`;
export const POTENTIAL_LABEL_STROKE_COLOR = WHITE;

// Label 관련 상수
export const HOVER_OPACITY_OVERRIDE = 0.2;
export const BORDER_OPACITY_LOW_OVERRIDE = 0.2;
export const BORDER_OPACITY_HIGH_OVERRIDE = 0.5;
export const FILL_OPACITY_THRESHOLD = 0.25;
export const DRAG_DISTANCE = 10;
export const LABEL_DASH = [7, 3];

// Mask 관련 상수
export const BRUSH_SIZE_VALUES = {
  MIN: 1,
  MAX: 200,
};

export const UNDO_REDO_STACK_LIMIT = 20;
export const ToolKey = {
  Pan: 'pan',
  Selection: 'selection',
  Polygon: 'polygon',
  Bbox: 'bbox',
  Mask: 'mask',
  Copy: 'copy',
};

export const TOOL_HOTKEY_OVERRIDES = {
  [ToolKey.Polygon]: {
    undoRedo: true,
    escape: true,
  },
  [ToolKey.Mask]: {
    e: true,
    b: true,
    undoRedo: true,
    escape: true,
  },
  [ToolKey.Bbox]: { escape: true },
};

export const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New', allowedRoles: ['OWNER', 'MANAGER'] },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    allowedRoles: ['OWNER', 'MANAGER', 'WORKER'],
  },
  {
    value: 'TO_REVIEW',
    label: 'To Review',
    allowedRoles: ['OWNER', 'MANAGER', 'WORKER'],
  },
  {
    value: 'DONE',
    label: 'Done',
    allowedRoles: ['OWNER', 'MANAGER', 'REVIEWER'],
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
    allowedRoles: ['OWNER', 'MANAGER'],
  },
  { value: 'SKIPPED', label: 'Skipped', allowedRoles: ['OWNER', 'MANAGER'] },
];
