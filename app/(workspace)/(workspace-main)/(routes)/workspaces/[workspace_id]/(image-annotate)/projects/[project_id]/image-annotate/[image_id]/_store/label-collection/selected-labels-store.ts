import { create } from 'zustand';
import { ImageLabel } from '../../_types/image-label';

interface State {
  selectedLabelIds: Set<string>;
}

interface Actions {
  deselectLabels: (labelIds: string[]) => void;
  setSelectedLabelIds: (labelIds: string[]) => void;
  toggleLabelSelection: (labelId: string) => void;

  selectAllLabels: (labels: Record<string, ImageLabel>) => void;
  resetSelection: () => void;
  getSelectedLabelIds: () => string[];
  isLabelSelected: (labelId: string) => boolean;
  isLabelSingleSelected: (labelId: string) => boolean;
}

type SelectedLabelsState = State & Actions;

export const useSelectedLabelsStore = create<SelectedLabelsState>(
  (set, get) => ({
    selectedLabelIds: new Set<string>(),

    deselectLabels: (labelIds) => {
      set((state) => {
        const newSelectedLabelIds = new Set(state.selectedLabelIds);
        labelIds.forEach((id) => newSelectedLabelIds.delete(id));
        return { selectedLabelIds: newSelectedLabelIds };
      });
    },

    setSelectedLabelIds: (labelIds) => {
      set((state) => {
        if (state.selectedLabelIds.size === 0 && labelIds.length === 0) {
          return state;
        }
        return { selectedLabelIds: new Set(labelIds) };
      });
    },

    toggleLabelSelection: (labelId) => {
      set((state) => {
        const newSelectedLabelIds = new Set(state.selectedLabelIds);
        if (newSelectedLabelIds.has(labelId)) {
          newSelectedLabelIds.delete(labelId);
        } else {
          newSelectedLabelIds.add(labelId);
        }
        return { selectedLabelIds: newSelectedLabelIds };
      });
    },

    selectAllLabels: (labels) => {
      const availableLabels = Object.values(labels)
        .filter((label) => !label.isDeleted)
        .map((label) => label.id);
      set({ selectedLabelIds: new Set(availableLabels) });
    },

    resetSelection: () => {
      set({ selectedLabelIds: new Set() });
    },

    getSelectedLabelIds: () => {
      return Array.from(get().selectedLabelIds);
    },

    isLabelSelected: (labelId) => {
      return get().selectedLabelIds.has(labelId);
    },

    isLabelSingleSelected: (labelId) => {
      return (
        get().selectedLabelIds.size === 1 && get().selectedLabelIds.has(labelId)
      );
    },
  }),
);
