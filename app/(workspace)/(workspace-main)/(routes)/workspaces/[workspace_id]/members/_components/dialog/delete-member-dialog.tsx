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
import { useParams } from 'next/navigation';
import { useState } from 'react';
import useDeleteMember from '../../_hooks/use-delete-member';
import { memberQueries } from '@/constants/querykey-factory';
import axios from 'axios';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { MemberFormValues } from '../sheet/update-member-sheet';

const DeleteMemberDialog = ({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: MemberFormValues;
}) => {
  const queryClient = useQueryClient();
  const { workspace_id: workspaceId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const deleteMemberMutation = useDeleteMember();

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteMemberMutation.mutateAsync({
        email: data.email,
        workspaceId: workspaceId as string,
      });
      queryClient.invalidateQueries({ queryKey: memberQueries.default() });
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
            Delete {data?.email || '-'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-black py-4">
              {`Are you sure you want to delete the workspace member "${data?.email || '-'}"?`}
            </p>
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

export default DeleteMemberDialog;
