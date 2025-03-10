import { create } from 'zustand';

type HoveredLabel = {
  id: string;
  classLabelId: string;
  zIndex: number;
} | null;

interface State {
  hoveredLabel: HoveredLabel;
}

interface Actions {
  setHoveredLabel: (label: HoveredLabel) => void;
  resetHoveredLabel: () => void;
  getHoveredLabel: () => HoveredLabel;
}

type HoveredLabelState = State & Actions;

export const useHoveredLabelsStore = create<HoveredLabelState>((set, get) => ({
  hoveredLabel: null,

  setHoveredLabel: (label) => {
    set({ hoveredLabel: label });
  },

  resetHoveredLabel: () => {
    set({ hoveredLabel: null });
  },

  getHoveredLabel: () => {
    return get().hoveredLabel;
  },
}));
