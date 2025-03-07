import { create } from 'zustand';
import { Tool } from '../_types/types';

interface State {
  toolId: Tool;
}

interface Actions {
  setToolId: (toolId: Tool) => void;
  getToolId: () => Tool;
}

type ToolState = State & Actions;

export const useToolStore = create<ToolState>((set, get) => ({
  toolId: Tool.Selection,

  getToolId: () => {
    return get().toolId;
  },

  setToolId: (toolId: Tool) => {
    set({ toolId });
  },
}));
