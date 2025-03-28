'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import axios from 'axios';
import useProfile from '../_hooks/use-profile';
import { useRouter } from 'next/navigation';
import useUpdatePassword from '../_hooks/use-update-password';
import { userQueries } from '@/constants/querykey-factory';
import { useQueryClient } from '@tanstack/react-query';

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function PasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data, isLoading: isProfileLoading } = useProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isProfileLoading && data?.provider === 'google') {
      router.replace('/accounts/profile');
    }
  }, [data, isProfileLoading, router]);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const updatePasswordMutation = useUpdatePassword();

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true);
    try {
      const response = await updatePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      queryClient.invalidateQueries({ queryKey: userQueries.default() });
      toast.success(response.message);
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to update password',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormDescription>
                Must be at least 6 characters long
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </Form>
  );
}
