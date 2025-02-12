'use client';

import useWorkspaceInfo from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-info';
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
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import useDeleteWorkspace from '../_hooks/use-delete-workspace';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { workspaceQueries } from '@/constants/querykey-factory';

const DangerZone = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { workspace_id: workspaceId } = useParams();
  const { data: currentWorkspace } = useWorkspaceInfo(workspaceId as string);

  const deleteWorkspaceMutation = useDeleteWorkspace();

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await deleteWorkspaceMutation.mutateAsync({
        workspaceId: workspaceId as string,
      });
      queryClient.invalidateQueries({ queryKey: workspaceQueries.default() });
      setIsDialogOpen(false);
      router.replace(`/workspaces`);
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
    <>
      <h1 className="text-xl font-bold mt-8 pb-4">Danger Zone</h1>
      <div className="border border-[#ff818266] rounded-sm">
        <div className="flex items-center p-4">
          <div className="flex w-full justify-between">
            <div className="flex-auto">
              <strong className="font-semibold">Delete this workspace</strong>
              <p className="font-normal">
                Once you delete a workspace. there is no going back. Please be
                certain
              </p>
            </div>
          </div>
          <div>
            <Button
              type="button"
              className="text-red-600 font-semibold hover:text-white hover:bg-red-600"
              variant={'outline'}
              onClick={() => setIsDialogOpen(true)}
            >
              Delete this Workspace
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Delete {currentWorkspace?.name || 'Default workspace'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p className="text-black py-4">
                {`Are you sure you want to delete the workspace "${currentWorkspace?.name || 'Default workspace'}"?`}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              className="text-red-600 font-semibold hover:text-white hover:bg-red-600"
              variant={'outline'}
              disabled={isLoading}
              onClick={onDelete}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              I want to delete this workspace
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DangerZone;
