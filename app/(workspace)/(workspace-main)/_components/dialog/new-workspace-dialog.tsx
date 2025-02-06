import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import useCreateWorkspace from '../../_hooks/use-create-workspace';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

const NewWorkspaceDialog = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    workspaceName: string;
  }>();

  const createWorkspaceMutation = useCreateWorkspace();

  const onSubmit = async (data: { workspaceName: string }) => {
    setIsLoading(true);
    try {
      const response = await createWorkspaceMutation.mutateAsync({
        workspaceName: data.workspaceName,
      });
      toast.info(response.message);
      router.push(`/workspaces/${response.data.id}/projects`);
      reset();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // AxiosError인 경우 처리
        const { status, data } = error.response;
        setCreateError(data?.message || 'Invalid workspace. Please try again.');
        console.error(`Error ${status}:`, data);
      } else {
        // 기타 에러 처리
        setCreateError(null); // 이전 에러 초기화
        toast('An unknown error occurred.');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Add a new workspace to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="workspaceName">Workspace name</Label>
              <Input
                id="workspaceName"
                placeholder="Please enter the new workspace name."
                {...register('workspaceName', {
                  required: 'Workspace name is required',
                  minLength: {
                    value: 4,
                    message:
                      'Workspace name must be at least 4 characters long',
                  },
                })}
                disabled={isLoading}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                autoCapitalize="none"
                type="text"
              />
              {(errors.workspaceName || createError) && (
                <p className="text-red-500 text-xs">
                  {errors.workspaceName?.message || createError}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
                transition"
              disabled={isLoading}
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkspaceDialog;
