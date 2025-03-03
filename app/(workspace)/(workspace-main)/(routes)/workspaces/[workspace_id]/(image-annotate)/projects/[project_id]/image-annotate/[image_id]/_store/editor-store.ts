import { create } from 'zustand';

interface EditorState {
  zoom: number;
  brushSize: number;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  setBrushSize: (size: number) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  zoom: 1,
  brushSize: 9,

  getZoom: () => {
    return get().zoom;
  },

  setZoom: (zoom: number) => {
    set({ zoom });
  },

  setBrushSize: (size: number) => {
    set({ brushSize: size });
  },
}));
