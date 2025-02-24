import { Dataset } from '@/app/(workspace)/(workspace-main)/_types';
import { Folder, MoreVertical, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteDatasetDialog from './dialog/delete-dataset-dialog';
import UpdateDatasetDialog from './dialog/update-dataset-dialog';

interface DatasetCardProps {
  dataset: Dataset;
}

const DatasetCard = ({ dataset }: DatasetCardProps) => {
  const router = useRouter();
  const { workspace_id: workspaceId, project_id: projectId } = useParams();
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const handleOpenEditDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowEditDialog(true);
  };

  const handleOpenDeleteDialog = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setShowDeleteDialog(true);
  };

  return (
    <li
      className="flex relative w-full items-center border-b hover:bg-gray-100"
      onClick={() => {
        router.push(
          `/workspaces/${workspaceId}/projects/${projectId}/file-manager?datasetId=${dataset?.id}`,
        );
      }}
    >
      <div className="w-full p-3 cursor-pointer">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row items-center w-4/5">
            <Folder className="w-5 h-5" />
            <div className="ml-2 w-9/10">
              <span className="text-xs truncate">{dataset?.name}</span>
            </div>
          </div>

          <div className="flex flex-row w-1/5">
            <button
              className="p-2 hover:bg-slate-200"
              onClick={handleOpenDeleteDialog}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 hover:bg-slate-200"
              onClick={handleOpenEditDialog}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <DeleteDatasetDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
        }}
        dataset={dataset}
      />
      {showEditDialog && (
        <UpdateDatasetDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
          }}
          dataset={dataset}
        />
      )}
    </li>
  );
};

export default DatasetCard;
