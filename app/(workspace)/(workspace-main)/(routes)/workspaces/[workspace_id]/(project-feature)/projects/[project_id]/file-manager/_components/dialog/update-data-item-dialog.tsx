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

import axios from 'axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { datasetQueries } from '@/constants/querykey-factory';

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

import { DataItem } from '@/app/(workspace)/(workspace-main)/_types';

import useUpdateDataItem from '../../_hooks/use-update-data-item';

const dataItemFormSchema = z.object({
  name: z.string().min(4, {
    message: 'Image name must be at least 4 characters long',
  }),
});

type DataItemFormValues = z.infer<typeof dataItemFormSchema>;

const UpdateDataItemDialog = ({
  isOpen,
  onClose,
  dataItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  dataItem: DataItem;
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<DataItemFormValues>({
    resolver: zodResolver(dataItemFormSchema),
    defaultValues: {
      name: dataItem.name,
    },
  });

  const updateDataItemMutation = useUpdateDataItem();

  const onSubmit = async (data: DataItemFormValues) => {
    setIsLoading(true);
    try {
      const response = await updateDataItemMutation.mutateAsync({
        dataItemId: dataItem.id,
        name: data.name,
      });
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: datasetQueries.default() });
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
          <DialogTitle>Update Image</DialogTitle>
          <DialogDescription>update a Image.</DialogDescription>
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
                  <FormLabel>Image name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please enter the update dataset name."
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
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDataItemDialog;
