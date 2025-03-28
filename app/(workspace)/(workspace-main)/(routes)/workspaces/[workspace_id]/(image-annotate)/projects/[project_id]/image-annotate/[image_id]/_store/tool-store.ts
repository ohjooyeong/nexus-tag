import { create } from 'zustand';
import { Tool } from '../_types/types';
import { usePanningStore } from './panning-store';
import { useClassLabelStore } from './class-label-store';
import { toast } from 'sonner';

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

    const getActiveClassLabel =
      useClassLabelStore.getState().getActiveClassLabel;

    if (
      toolId !== Tool.Pan &&
      toolId !== Tool.Selection &&
      getActiveClassLabel() === null
    ) {
      toast.error('Please create and select a class label first');
      return;
    }

    set({ toolId });
  },

  resetActiveTool: () => {
    set({ toolId: Tool.Selection });
  },
}));
