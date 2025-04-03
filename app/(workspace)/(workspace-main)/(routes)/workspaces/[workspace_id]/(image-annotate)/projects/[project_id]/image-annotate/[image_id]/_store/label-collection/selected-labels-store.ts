import { create } from 'zustand';
import { ImageLabel } from '../../_types/image-label';
import { useLabelsStore } from './labels-store';

interface State {
  selectedLabelIds: Set<string>;
  selectedLabelIdsArray: string[];
}

interface Actions {
  deselectLabels: (labelIds: string[]) => void;
  setSelectedLabelIds: (labelIds: string[]) => void;
  getSelectedLabelIds: () => string[];

  toggleLabelSelection: (labelId: string) => void;

  selectAllLabels: (labels: Record<string, ImageLabel>) => void;
  resetSelection: () => void;
  isLabelSelected: (labelId: string) => boolean;
  isLabelSingleSelected: (labelId: string) => boolean;
  getEditedMaskLabel: () => ImageLabel | null;
  isEditingMask: () => boolean;
}

type SelectedLabelsState = State & Actions;

export const useSelectedLabelsStore = create<SelectedLabelsState>(
  (set, get) => ({
    selectedLabelIds: new Set<string>(),
    selectedLabelIdsArray: [],

    deselectLabels: (labelIds) => {
      set((state) => {
        const newSelectedLabelIds = new Set(state.selectedLabelIds);
        labelIds.forEach((id) => newSelectedLabelIds.delete(id));
        return {
          selectedLabelIds: newSelectedLabelIds,
          selectedLabelIdsArray: Array.from(newSelectedLabelIds),
        };
      });
    },

    setSelectedLabelIds: (labelIds) => {
      set((state) => {
        if (state.selectedLabelIds.size === 0 && labelIds.length === 0) {
          return state;
        }
        const newSet = new Set(labelIds);
        return {
          selectedLabelIds: newSet,
          selectedLabelIdsArray: Array.from(newSet),
        };
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
        return {
          selectedLabelIds: newSelectedLabelIds,
          selectedLabelIdsArray: Array.from(newSelectedLabelIds),
        };
      });
    },

    selectAllLabels: (labels) => {
      const availableLabels = Object.values(labels)
        .filter((label) => !label.isDeleted)
        .map((label) => label.id);
      const newSelectedLabelIds = new Set(availableLabels);
      set({
        selectedLabelIds: newSelectedLabelIds,
        selectedLabelIdsArray: Array.from(newSelectedLabelIds),
      });
    },

    resetSelection: () => {
      set({
        selectedLabelIds: new Set(),
        selectedLabelIdsArray: [],
      });
    },

    // 값을 가져올 때 Array.from으로 매번 변환하는 건 비효율적이고,
    // useEffect에 사용 후 값을 deps에 넣을 때 무한 렌더링이 발생해서 수정
    getSelectedLabelIds: () => {
      return get().selectedLabelIdsArray;
    },

    isLabelSelected: (labelId) => {
      return get().selectedLabelIds.has(labelId);
    },

    isLabelSingleSelected: (labelId) => {
      return (
        get().selectedLabelIds.size === 1 && get().selectedLabelIds.has(labelId)
      );
    },

    // 단일 선택된 마스크 라벨을 반환하는 함수
    getEditedMaskLabel: () => {
      const selectedIds = get().selectedLabelIdsArray;
      if (selectedIds.length === 1) {
        const labels = useLabelsStore.getState().getLabelsMap();
        const label = labels[selectedIds[0]];
        if (label?.mask) return label;
      }
      return null;
    },

    // 마스크 편집 중인지 확인하는 함수
    isEditingMask: () => {
      return !!get().getEditedMaskLabel();
    },
  }),
);
