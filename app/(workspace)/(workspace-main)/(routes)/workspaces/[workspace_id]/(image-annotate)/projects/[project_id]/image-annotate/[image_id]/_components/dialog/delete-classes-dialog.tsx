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

import { classLabelQueries } from '@/constants/querykey-factory';
import axios from 'axios';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';

import useDeleteClassLabel from '../../_hooks/use-delete-class-label';
import { LabelClass } from '../../_types/label-class';
import {
  useLabelsHistory,
  useLabelsStore,
} from '../../_store/label-collection/labels-store';
import { useSelectedLabelsStore } from '../../_store/label-collection/selected-labels-store';

const DeleteClassLabelDialog = ({
  isOpen,
  onClose,
  classLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  classLabel: LabelClass;
}) => {
  const queryClient = useQueryClient();
  const { resetSelection } = useSelectedLabelsStore();

  const [isLoading, setIsLoading] = useState(false);

  const deleteClassLabelMutation = useDeleteClassLabel();
  const clearHistory = useLabelsHistory((state) => state.clear);

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteClassLabelMutation.mutateAsync({
        classLabelId: classLabel.id,
      });
      const labelsStore = useLabelsStore.getState();
      const relatedLabelIds = labelsStore
        .getLabels()
        .filter((label) => label.classLabelId === classLabel.id)
        .map((label) => label.id);

      if (relatedLabelIds.length > 0) {
        labelsStore.deleteLabels(relatedLabelIds);
        clearHistory();
      }
      resetSelection();

      queryClient.invalidateQueries({ queryKey: classLabelQueries.default() });
      toast.success(response.message);

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
            Delete {classLabel?.name || '-'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-black py-4">
              {`Are you sure you want to delete the class label? This action cannot be undone.`}
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
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteClassLabelDialog;
