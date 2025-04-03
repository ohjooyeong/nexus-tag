import { create } from 'zustand';

export type ActionTriggerType =
  | 'invert'
  | 'fillClosed'
  | 'discard'
  | 'convert'
  | 'undo'
  | 'redo'
  | null;

interface State {
  brushSize: number;
  overpainting: boolean;
  mode: 'brush' | 'eraser';
  actionTrigger: ActionTriggerType;
  maskExists: boolean;
}

interface Actions {
  getBrushSize: () => number;
  getMode: () => 'brush' | 'eraser';
  getActionTrigger: () => ActionTriggerType;
  getOverpainting: () => boolean;
  getMaskExists: () => boolean;

  setMaskExists: (exists: boolean) => void;
  setBrushSize: (size: number) => void;
  setBrush: () => void;
  setEraser: () => void;
  toggleMode: () => void;
  toggleOverpainting: () => void;
  triggerAction: (type: ActionTriggerType) => void;
}

type MaskState = State & Actions;

export const useMaskStore = create<MaskState>((set, get) => ({
  brushSize: 1,
  overpainting: true,
  mode: 'brush',
  actionTrigger: null,
  maskExists: false,

  getBrushSize: () => {
    return get().brushSize;
  },

  getMode: () => {
    return get().mode;
  },

  getActionTrigger: () => {
    return get().actionTrigger;
  },

  getOverpainting: () => {
    return get().overpainting;
  },

  getMaskExists: () => {
    return get().maskExists;
  },

  setMaskExists: (exists: boolean) => {
    set({ maskExists: exists });
  },

  setBrushSize: (size: number) => {
    set({ brushSize: size });
  },

  setEraser: () => {
    set({ mode: 'eraser' });
  },

  toggleMode: () => {
    set({ mode: get().mode === 'brush' ? 'eraser' : 'brush' });
  },

  toggleOverpainting: () => {
    set({ overpainting: !get().overpainting });
  },

  setBrush: () => {
    set({ mode: 'brush' });
  },

  triggerAction: (type: ActionTriggerType) => {
    set({ actionTrigger: type });
  },
}));
