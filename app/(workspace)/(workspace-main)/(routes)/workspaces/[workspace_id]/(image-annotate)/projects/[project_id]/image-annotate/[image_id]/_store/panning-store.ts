import { create } from 'zustand';

interface PanningState {
  panningEnabled: boolean;

  getEnabledPanning: () => boolean;
  setEnabledPanning: (enabled: boolean) => void;
}

export const usePanningStore = create<PanningState>((set, get) => ({
  panningEnabled: false,

  getEnabledPanning: () => {
    return get().panningEnabled;
  },

  setEnabledPanning: (enabled: boolean) => {
    set({ panningEnabled: enabled });
  },
}));
