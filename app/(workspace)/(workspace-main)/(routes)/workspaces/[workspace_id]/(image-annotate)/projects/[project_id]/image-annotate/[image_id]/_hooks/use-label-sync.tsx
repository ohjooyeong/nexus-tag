'use client';

import { useParams } from 'next/navigation';
import { useLabelSyncStore } from '../_store/label-collection/label-sync-store';
import { useEffect } from 'react';

export default function useLabelSync() {
  const params = useParams();
  const syncLabels = useLabelSyncStore((state) => state.syncLabels);
  const stage = useLabelSyncStore((state) => state.stage);

  useEffect(() => {
    if (stage === 'dirty') {
      const timer = setTimeout(() => {
        syncLabels({
          workspaceId: params.workspace_id as string,
          projectId: params.project_id as string,
          imageId: params.image_id as string,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [stage, syncLabels, params]);

  return {
    stage,
    syncLabels,
  };
}
