import { create } from 'zustand';
import { Tool } from '../_types/types';

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
    set({ toolId });
  },

  resetActiveTool: () => {
    set({ toolId: Tool.Selection });
  },
}));
