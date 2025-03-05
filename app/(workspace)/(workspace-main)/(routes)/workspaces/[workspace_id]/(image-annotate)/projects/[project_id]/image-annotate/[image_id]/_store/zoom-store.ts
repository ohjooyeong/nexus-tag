import { create } from 'zustand';

interface ZoomState {
  zoom: number;

  getZoom: () => number;
  setZoom: (zoom: number) => void;
}

export const useZoomStore = create<ZoomState>((set, get) => ({
  zoom: 1,

  getZoom: () => {
    return get().zoom;
  },

  setZoom: (zoom: number) => {
    set({ zoom });
  },
}));
