import { create } from 'zustand';
import { temporal } from 'zundo';
import { devtools } from 'zustand/middleware';
import shortid from 'shortid';
import { ImageLabel } from '../_types/image-label';
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
}

// 전체 Store 타입
type LabelsState = State & Actions;

export const useLabelsStore = create<LabelsState>()(
  devtools(
    temporal(
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
        },
      }),
      {
        partialize: (state: LabelsState): State => ({
          labels: state.labels,
          currentGroup: state.currentGroup,
        }),
        equality: (prev: State, next: State) => {
          return (
            prev.currentGroup === next.currentGroup &&
            JSON.stringify(prev.labels) === JSON.stringify(next.labels)
          );
        },
      },
    ),
  ),
);

type TemporalState = {
  temporal: {
    undo: () => void;
    redo: () => void;
    clear: () => void;
  };
};

export const useLabelsHistory = () => {
  const temporal = (useLabelsStore as unknown as TemporalState).temporal;

  return {
    undo: temporal.undo,
    redo: temporal.redo,
    clear: temporal.clear,
  };
};
