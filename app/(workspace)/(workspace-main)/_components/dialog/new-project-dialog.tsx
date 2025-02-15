'use client';

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

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { projectQueries } from '@/constants/querykey-factory';
import useCreateProject from '../../_hooks/use-create-project';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const projectFormSchema = z.object({
  name: z.string().min(4, {
    message: 'Project name must be at least 4 characters long',
  }),
  description: z
    .string()
    .min(4, { message: 'Description must be at least 4 characters long' }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const NewProjectDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { workspace_id: workspaceId } = useParams();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createProjectMutation = useCreateProject();

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);
    try {
      const response = await createProjectMutation.mutateAsync({
        name: data.name,
        description: data.description,
        workspaceId: workspaceId as string,
      });
      toast.info(response.message);
      queryClient.invalidateQueries({ queryKey: projectQueries.default() });
      form.reset();
      onClose();
      router.push(`/workspaces/${workspaceId}/projects`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // AxiosError인 경우 처리
        const { status, data } = error.response;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Add a new project to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2 pb-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please enter the new Project name."
                      {...field}
                      disabled={isLoading}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      autoCapitalize="none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please enter the new Project description."
                      {...field}
                      disabled={isLoading}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      autoCapitalize="none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
