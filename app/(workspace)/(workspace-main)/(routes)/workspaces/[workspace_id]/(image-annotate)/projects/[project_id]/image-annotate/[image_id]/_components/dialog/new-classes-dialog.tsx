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
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { classLabelQueries } from '@/constants/querykey-factory';

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
import useCreateClassLabel from '../../_hooks/use-create-class-label';
import { LabelClassType } from '../../_types/label-class';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HexColorPicker } from 'react-colorful';
import useClassLabels from '../../_hooks/use-class-labels';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// 상단에 함수 추가
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const NewClassLabelDialog = ({
  isOpen,
  onClose,
  currentType,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentType: LabelClassType;
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  const { data: classLabels } = useClassLabels();

  const createClassLabelFormSchema = (classLabels: any[] = []) =>
    z.object({
      name: z
        .string()
        .min(1, {
          message: 'ClassLabel name must be at least 1 characters long',
        })
        .refine(
          (name) =>
            !classLabels?.some(
              (label) => label.name.toLowerCase() === name.toLowerCase(),
            ),
          {
            message: 'A class label with this name already exists',
          },
        ),
      description: z.string().optional(),
      color: z.string(),
      type: z.nativeEnum(LabelClassType, {
        errorMap: () => ({ message: 'Please select a valid type.' }),
      }),
    });

  const classLabelFormSchema = createClassLabelFormSchema(classLabels);
  type ClassLabelFormValues = z.infer<typeof classLabelFormSchema>;

  const form = useForm<ClassLabelFormValues>({
    resolver: zodResolver(classLabelFormSchema),
    defaultValues: {
      name: '',
      description: '',
      color: generateRandomColor(),
      type: currentType,
    },
  });

  const createClassLabelMutation = useCreateClassLabel();

  const onSubmit = async (data: ClassLabelFormValues) => {
    setIsLoading(true);
    try {
      const response = await createClassLabelMutation.mutateAsync({
        name: data.name,
        description: data.description,
        color: data.color,
        type: data.type,
        projectId: projectId as string,
        workspaceId: workspaceId as string,
      });
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: classLabelQueries.default() });
      form.reset();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // AxiosError인 경우 처리
        const { status, data } = error.response;
        toast.error(data.message);

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
          <DialogTitle>Create Class Label</DialogTitle>
          <DialogDescription>Add a new class Label.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please enter the new class Label name."
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
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-2 py-2">
                  <FormLabel>Class Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={currentType}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified type to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-sm">
                      <SelectItem value={LabelClassType.OBJECT}>
                        {LabelClassType.OBJECT}
                      </SelectItem>
                      <SelectItem value={LabelClassType.SEMANTIC}>
                        {LabelClassType.SEMANTIC}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-md border border-input"
                            style={{ backgroundColor: field.value }}
                          />
                          <Input
                            {...field}
                            type="text"
                            placeholder="#000000"
                            value={field.value}
                            readOnly
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <div className="flex flex-col gap-4">
                          <HexColorPicker
                            color={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
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
                      placeholder="the description of the class label"
                      {...field}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      disabled={isLoading}
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

export default NewClassLabelDialog;
