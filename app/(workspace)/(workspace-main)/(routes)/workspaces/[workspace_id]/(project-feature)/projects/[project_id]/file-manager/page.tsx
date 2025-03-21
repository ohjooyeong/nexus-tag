'use client';

import { Button } from '@/components/ui/button';
import DatasetFileManager from './_components/file-manager';
import NewUploadImagesSheet from './_components/sheet/new-upload-images-sheet';
import { useState } from 'react';
import useWorkspaceMyRole from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-my-role';

export default function FileManagerPage() {
  const [showNewUploadImagesSheet, setShowNewUploadImagesSheet] =
    useState(false);

  const { data: currentMyRole } = useWorkspaceMyRole();

  const isMyRoleOwnerOrManager =
    currentMyRole === 'OWNER' || currentMyRole === 'MANAGER';

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9 gap-2">
          <h1 className="flex items-center text-2xl font-bold">File Manager</h1>
          {isMyRoleOwnerOrManager && (
            <Button onClick={() => setShowNewUploadImagesSheet(true)}>
              Upload images
            </Button>
          )}
        </div>

        <DatasetFileManager />
      </div>

      {showNewUploadImagesSheet && (
        <NewUploadImagesSheet
          isOpen={showNewUploadImagesSheet}
          onClose={() => setShowNewUploadImagesSheet(false)}
        />
      )}
    </div>
  );
}
