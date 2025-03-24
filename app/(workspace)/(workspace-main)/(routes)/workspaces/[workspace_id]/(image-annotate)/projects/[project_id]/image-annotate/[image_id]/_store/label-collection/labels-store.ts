import { create, useStore } from 'zustand';
import { temporal, TemporalState } from 'zundo';
import shortid from 'shortid';
import { ImageLabel } from '../../_types/image-label';
import { useLabelSyncStore } from './label-sync-store';

// State 타입
interface State {
  labels: Record<string, ImageLabel>;
  currentGroup?: string;
}

// Actions 타입
interface Actions {
  initializeLabels: (labels: ImageLabel[]) => void;
  addLabels: (newLabels: Array<Partial<ImageLabel> & { id: string }>) => void;
  deleteLabels: (labelIds: string[]) => void;
  updateLabels: (
    updates: Array<{ id: string; changes: Partial<ImageLabel> }>,
    undoGroup?: string,
  ) => void;
  setCurrentGroup: (group?: string) => void;
  getLabels: () => ImageLabel[];
  getAvaliableLabels: () => ImageLabel[];
  getLabelsMap: () => Record<string, ImageLabel>;
  getVisibleLabels: () => ImageLabel[];
  getLabelCountByClassId: (classId: string) => number;
}

// 전체 Store 타입
type LabelsState = State & Actions;

export const useLabelsStore = create(
  temporal<LabelsState>(
    (set, get) => ({
      labels: {},
      currentGroup: undefined,

      setCurrentGroup: (group?: string) => {
        set({ currentGroup: group });
      },

      initializeLabels: (labels) => {
        const labelsMap = labels.reduce(
          (acc, label) => {
            acc[label.id] = label;
            return acc;
          },
          {} as Record<string, ImageLabel>,
        );

        set({ labels: labelsMap });
        useLabelSyncStore.getState().initializeLabels(labelsMap);
      },

      addLabels: (newLabels) => {
        const currentState = get().labels;
        const availableLabels = Object.values(currentState).filter(
          (label) => !label.isDeleted,
        );
        const zIndex =
          availableLabels.length === 0
            ? 0
            : Math.max(...availableLabels.map((label) => label.zIndex || 0)) +
              1;

        const labelsToAdd = newLabels.map((label) => ({
          ...label,
          clientId: shortid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          zIndex: label.zIndex ?? zIndex,
        }));

        set((state) => ({
          labels: {
            ...state.labels,
            ...labelsToAdd.reduce(
              (acc, label) => {
                acc[label.id] = label as ImageLabel;
                return acc;
              },
              {} as Record<string, ImageLabel>,
            ),
          },
        }));
        useLabelSyncStore.getState().markAsDirty();
      },

      deleteLabels: (labelIds) => {
        set((state) => {
          const newLabels = { ...state.labels };
          labelIds.forEach((id) => {
            if (newLabels[id]) {
              newLabels[id] = {
                ...newLabels[id],
                isDeleted: true,
                clientId: shortid(),
                updatedAt: new Date().toISOString(),
              };
            }
          });

          return { labels: newLabels };
        });
        useLabelSyncStore.getState().markAsDirty();
      },

      updateLabels: (updates, undoGroup) => {
        const currentGroup = get().currentGroup;

        // 새로운 그룹이 시작되면 현재 상태를 저장
        if (undoGroup && undoGroup !== currentGroup) {
          set({ currentGroup: undoGroup });
        }

        set((state) => {
          const newLabels = { ...state.labels };
          updates.forEach(({ id, changes }) => {
            if (newLabels[id]) {
              newLabels[id] = {
                ...newLabels[id],
                ...changes,
                clientId: shortid(),
                updatedAt: new Date().toISOString(),
              };
            }
          });

          return { labels: newLabels };
        });
        useLabelSyncStore.getState().markAsDirty();
      },

      getLabels: () => {
        return Object.values(get().labels);
      },

      getAvaliableLabels: () => {
        return Object.values(get().labels).filter((label) => !label.isDeleted);
      },

      getLabelsMap: () => {
        return get().labels;
      },

      getVisibleLabels: () => {
        return Object.values(get().labels)
          .filter((label) => !label.isDeleted)
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      },

      getLabelCountByClassId: (classId: string) => {
        const labels = Object.values(get().labels);
        return labels.filter(
          (label) => !label.isDeleted && label.classLabelId === classId,
        ).length;
      },
    }),

    {
      partialize: (state: LabelsState): LabelsState => {
        useLabelSyncStore.getState().markAsDirty();

        return {
          ...state,
          currentGroup: state.currentGroup,
          labels: state.labels,
        };
      },
      equality: (prev: State, next: State) => {
        return (
          prev.currentGroup === next.currentGroup &&
          JSON.stringify(prev.labels) === JSON.stringify(next.labels)
        );
      },
    },
  ),
);

export const useLabelsHistory = <T>(
  selector: (state: TemporalState<LabelsState>) => T,
  equality?: (a: T, b: T) => boolean,
) =>
  useStore(
    useLabelsStore.temporal,
    selector as (state: TemporalState<any>) => T,
  );
