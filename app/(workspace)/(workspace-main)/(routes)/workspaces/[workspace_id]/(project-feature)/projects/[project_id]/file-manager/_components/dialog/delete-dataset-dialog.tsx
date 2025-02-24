import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { datasetQueries } from '@/constants/querykey-factory';
import axios from 'axios';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import useDeleteDataset from '../../_hooks/use-delete-dataset';
import { Dataset } from '@/app/(workspace)/(workspace-main)/_types';
import { useParams, useRouter } from 'next/navigation';

const DeleteDatasetDialog = ({
  isOpen,
  onClose,
  dataset,
}: {
  isOpen: boolean;
  onClose: () => void;
  dataset: Dataset;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const deleteDatasetMutation = useDeleteDataset();

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteDatasetMutation.mutateAsync({
        datasetId: dataset.id,
      });
      queryClient.invalidateQueries({ queryKey: datasetQueries.default() });
      toast.success(response.message);
      router.push(
        `/workspaces/${workspaceId}/projects/${projectId}/file-manager`,
      );
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // AxiosError인 경우 처리
        const { status, data } = error.response;
        toast.error(data?.message);
        console.error(`Error ${status}:`, data);
      } else {
        // 기타 에러 처리
        toast.error('An unknown error occurred.');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Delete {dataset?.name || '-'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-black py-4">
              {`Deleting a dataset will delete all images in the dataset, do you want to delete it?`}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button
            className="text-red-600 font-semibold hover:text-white hover:bg-red-600"
            variant={'outline'}
            disabled={isLoading}
            onClick={onDelete}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDatasetDialog;
