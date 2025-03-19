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

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import DangerZone from './danger-zone';
import useUpdateProject from '../_hooks/use-update-project';
import { toast } from 'sonner';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { projectQueries } from '@/constants/querykey-factory';
import useProjectMyRole from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-my-role';
import useProjectInfo from '../../../../../_hooks/use-project-info';

const projectFormSchema = z.object({
  name: z.string().min(4, {
    message: 'Project name must be at least 4 characters long',
  }),
  description: z.string(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const ProjectSetupForm = () => {
  const queryClient = useQueryClient();
  const { workspace_id: workspaceId, project_id: projectId } = useParams();
  const { data: currentProject } = useProjectInfo(projectId as string);
  const { data: currentMyRole } = useProjectMyRole();

  const isMyRoleOwnerOrManager =
    currentMyRole === 'OWNER' || currentMyRole === 'MANAGER';

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState(false);

  const updateProjectMutation = useUpdateProject();

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);
    try {
      const response = await updateProjectMutation.mutateAsync({
        name: data.name,
        workspaceId: workspaceId as string,
        projectId: projectId as string,
        description: data.description,
      });
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: projectQueries.default() });
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
        values.name !== currentProject?.name ||
        values.description !== currentProject?.description;
      setIsChanged(isModified);
    });
    return () => subscription.unsubscribe();
  }, [form, currentProject]);

  useEffect(() => {
    if (currentProject) {
      form.reset({
        name: currentProject.name,
        description: currentProject.description,
      });
    }
  }, [currentProject, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please write the name of the project"
                  {...field}
                  disabled={isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  autoCapitalize="none"
                  readOnly={!isMyRoleOwnerOrManager}
                />
              </FormControl>
              <FormDescription>
                This is your public display project name.
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
                  placeholder="Please write the description of the project"
                  {...field}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  autoCapitalize="none"
                  disabled={isLoading}
                  readOnly={!isMyRoleOwnerOrManager}
                />
              </FormControl>
              <FormDescription>
                This is a description of the project.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        {isMyRoleOwnerOrManager && (
          <div className="flex gap-4 justify-end">
            <Button
              type="submit"
              disabled={!isChanged || isLoading}
              className="transition-all duration-300"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update project
            </Button>
          </div>
        )}
      </form>
      {isMyRoleOwnerOrManager && <DangerZone />}
    </Form>
  );
};

export default ProjectSetupForm;
