'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import useWorkspaceInfo from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-info';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import DangerZone from './danger-zone';
import useUpdateWorkspace from '../_hooks/use-update-workspace';
import { toast } from 'sonner';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { workspaceQueries } from '@/constants/querykey-factory';

const workspaceFormSchema = z.object({
  name: z.string().min(4, {
    message: 'Workspace name must be at least 4 characters long',
  }),
  description: z.string(),
});

type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;

const GeneralForm = () => {
  const queryClient = useQueryClient();
  const { workspace_id: workspaceId } = useParams();
  const { data: currentWorkspace } = useWorkspaceInfo(workspaceId as string);

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: currentWorkspace?.name || '',
      description: currentWorkspace?.description || '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState(false);

  const updateWorkspaceMutation = useUpdateWorkspace();

  const onSubmit = async (data: WorkspaceFormValues) => {
    setIsLoading(true);
    try {
      const response = await updateWorkspaceMutation.mutateAsync({
        name: data.name,
        workspaceId: workspaceId as string,
        description: data.description,
      });
      toast.info(response.message);
      queryClient.invalidateQueries({ queryKey: workspaceQueries.default() });
      setIsChanged(false);
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

  useEffect(() => {
    const subscription = form.watch((values) => {
      const isModified =
        values.name !== currentWorkspace?.name ||
        values.description !== currentWorkspace?.description;
      setIsChanged(isModified);
    });
    return () => subscription.unsubscribe();
  }, [form, currentWorkspace]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please write the name of the workspace"
                  {...field}
                  disabled={isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  autoCapitalize="none"
                />
              </FormControl>
              <FormDescription>
                This is your public display workspace name.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please write the description of the workspace"
                  {...field}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  autoCapitalize="none"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                This is a description of the workspace.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-end">
          <Button
            type="submit"
            disabled={!isChanged || isLoading}
            className="transition-all duration-300"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update workspace
          </Button>
        </div>
      </form>
      <DangerZone />
    </Form>
  );
};

export default GeneralForm;
