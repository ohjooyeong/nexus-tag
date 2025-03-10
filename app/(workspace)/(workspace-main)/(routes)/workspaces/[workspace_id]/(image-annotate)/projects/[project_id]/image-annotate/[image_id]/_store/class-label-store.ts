import { create } from 'zustand';
import { LabelClass } from '../_types/label-class';

interface State {
  activeClassLabel: LabelClass | null;
  classLabels: Record<string, LabelClass>;
  hiddenClassLabelIds: Set<string>;
  hoveredClassLabelId: string | null;
}

interface Actions {
  initializeClassLabels: (classLabels: LabelClass[]) => void;
  getClassLabels: () => Record<string, LabelClass>;
  getActiveClassLabel: () => LabelClass | null;
  getActiveClassLabelId: () => string | null;
  setActiveClassLabel: (classLabel: LabelClass | null) => void;
  hideClassLabels: (classIds: string[]) => void;
  showClassLabels: (classIds: string[]) => void;
  toggleClassLabel: (classId: string) => void;
  isClassLabelHidden: (classId: string) => boolean;
  setHoveredClassLabelId: (classId: string | null) => void;
  isClassLabelHovered: (classId: string) => boolean;
}

type ClassLabelStore = State & Actions;

export const useClassLabelStore = create<ClassLabelStore>((set, get) => ({
  activeClassLabel: null,
  classLabels: {},
  hiddenClassLabelIds: new Set<string>(),
  hoveredClassLabelId: null,

  initializeClassLabels: (classLabels: LabelClass[]) => {
    const classLabelsMap = classLabels.reduce(
      (acc, classLabel) => {
        acc[classLabel.id] = classLabel;
        return acc;
      },
      {} as Record<string, LabelClass>,
    );
    set({ classLabels: classLabelsMap });
  },

  getClassLabels: () => {
    return get().classLabels;
  },

  getActiveClassLabel: () => {
    return get().activeClassLabel;
  },

  getActiveClassLabelId: () => {
    return get().activeClassLabel?.id || null;
  },

  setActiveClassLabel: (classLabel: LabelClass | null) => {
    set({ activeClassLabel: classLabel });
  },

  hideClassLabels: (classIds: string[]) => {
    set((state) => {
      const newHiddenClassIds = new Set(state.hiddenClassLabelIds);
      classIds.forEach((id) => newHiddenClassIds.add(id));
      return { hiddenClassLabelIds: newHiddenClassIds };
    });
  },

  showClassLabels: (classIds: string[]) => {
    set((state) => {
      const newHiddenClassIds = new Set(state.hiddenClassLabelIds);
      classIds.forEach((id) => newHiddenClassIds.delete(id));
      return { hiddenClassLabelIds: newHiddenClassIds };
    });
  },

  toggleClassLabel: (classId: string) => {
    set((state) => {
      const newHiddenClassIds = new Set(state.hiddenClassLabelIds);
      if (newHiddenClassIds.has(classId)) {
        newHiddenClassIds.delete(classId);
      } else {
        newHiddenClassIds.add(classId);
      }
      return { hiddenClassLabelIds: newHiddenClassIds };
    });
  },

  isClassLabelHidden: (classId: string) => {
    return get().hiddenClassLabelIds.has(classId);
  },

  setHoveredClassLabelId: (classId: string | null) => {
    set({ hoveredClassLabelId: classId });
  },

  isClassLabelHovered: (classId: string) => {
    return get().hoveredClassLabelId === classId;
  },
}));
