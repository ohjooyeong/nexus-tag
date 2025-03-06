import { create } from 'zustand';
import { LabelClass } from '../_types/label-class';

interface State {
  activeClassLabel: LabelClass | null;
}

interface Actions {
  getActiveClassLabel: () => LabelClass | null;
  getActiveClassLabelId: () => string | null;
  setActiveClassLabel: (classLabel: LabelClass | null) => void;
}

type ClassLabelStore = State & Actions;

export const useClassLabelStore = create<ClassLabelStore>((set, get) => ({
  activeClassLabel: null,

  getActiveClassLabel: () => {
    return get().activeClassLabel;
  },

  getActiveClassLabelId: () => {
    return get().activeClassLabel?.id || null;
  },

  setActiveClassLabel: (classLabel: LabelClass | null) => {
    set({ activeClassLabel: classLabel });
  },
}));
