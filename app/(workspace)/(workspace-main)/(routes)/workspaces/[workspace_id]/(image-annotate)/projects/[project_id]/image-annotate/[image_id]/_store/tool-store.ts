import { create } from 'zustand';
import { Tool } from '../_types/types';
import { usePanningStore } from './panning-store';

interface State {
  toolId: Tool;
}

interface Actions {
  getActiveTool: () => Tool;
  setActiveTool: (toolId: Tool) => void;
  resetActiveTool: () => void;
}

type ToolState = State & Actions;

export const useToolStore = create<ToolState>((set, get) => ({
  toolId: Tool.Selection,

  getActiveTool: () => {
    return get().toolId;
  },

  setActiveTool: (toolId: Tool) => {
    const setEnabledPanning = usePanningStore.getState().setEnabledPanning;

    if (toolId === Tool.Pan) {
      setEnabledPanning(true);
    } else {
      setEnabledPanning(false);
    }
    set({ toolId });
  },

  resetActiveTool: () => {
    set({ toolId: Tool.Selection });
  },
}));
