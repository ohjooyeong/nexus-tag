import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ImageLabel } from '../../_types/image-label';
import { useLabelsStore } from './labels-store';
import axiosInstance from '@/config/axios-instance';

interface State {
  lastSavedLabels: Record<string, ImageLabel>;
  stage:
    | 'initializing'
    | 'initialized'
    | 'dirty'
    | 'saving'
    | 'saved'
    | 'savingFailure'
    | 'initializationFailure';
  lastSavedAt: string | null;
  errorMessage: string;
}

interface Actions {
  initializeLabels: (labels: Record<string, ImageLabel>) => void;
  syncLabels: (params: {
    workspaceId: string;
    projectId: string;
    imageId: string;
  }) => Promise<void>;
  markAsDirty: () => void;
}

type LabelSyncState = State & Actions;

const stripReadOnlyFields = (label: ImageLabel) => {
  const { createdAt, updatedAt, ...rest } = label;
  return rest;
};

export const useLabelSyncStore = create<LabelSyncState>()(
  devtools((set, get) => ({
    lastSavedLabels: {},
    stage: 'initializing',
    lastSavedAt: null,
    errorMessage: '',

    initializeLabels: (labels) => {
      set({
        lastSavedLabels: labels,
        lastSavedAt: new Date().toISOString(),
        stage: 'initialized',
        errorMessage: '',
      });
    },

    markAsDirty: () => {
      set({ stage: 'dirty' });
    },

    syncLabels: async ({ workspaceId, projectId, imageId }) => {
      const { lastSavedLabels, stage } = get();
      const currentLabels = useLabelsStore.getState().labels;

      if (stage === 'saving') return;

      set({ stage: 'saving', errorMessage: '' });

      try {
        const savedLabels =
          Object.values(lastSavedLabels).map(stripReadOnlyFields);
        const presentLabels =
          Object.values(currentLabels).map(stripReadOnlyFields);

        const dirtyLabels = [
          ...presentLabels.filter(
            ({ id, clientId }) =>
              !lastSavedLabels[id] ||
              clientId !== lastSavedLabels[id]?.clientId,
          ),

          ...savedLabels
            .filter((label) => !currentLabels[label.id])
            .map((label) => ({
              ...label,
              isDeleted: true,
            })),
        ];

        if (dirtyLabels.length > 0) {
          await axiosInstance.post(
            `/workspaces/${workspaceId}/projects/${projectId}/items/${imageId}/labels`,
            dirtyLabels,
          );
        }

        set({
          lastSavedLabels: currentLabels,
          lastSavedAt: new Date().toISOString(),
          stage: 'saved',
        });
      } catch (error) {
        set({
          stage: 'savingFailure',
          errorMessage: error instanceof Error ? error.message : 'Sync failed',
        });
      }
    },
  })),
);
