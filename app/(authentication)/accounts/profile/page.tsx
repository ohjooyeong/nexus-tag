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
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useProfile from '../_hooks/use-profile';
import { userQueries } from '@/constants/querykey-factory';
import useUpdateProfile from '../_hooks/use-update-profile';

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email(),
  profileImg: z.string().nullable(),
  birthdate: z.string().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || '',
      email: profile?.email || '',
      profileImg: profile?.profile?.profileImg || null,
      birthdate: null,
    },
  });

  const updateProfileMutation = useUpdateProfile();

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      const response = await updateProfileMutation.mutateAsync({
        username: data.username,
        // profileImg: data.profileImg || '',
      });

      queryClient.invalidateQueries({ queryKey: userQueries.default() });
      toast.success(response.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to update profile',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username,
        profileImg: profile?.profile?.profileImg || null,
        email: profile?.email || '',
        birthdate: null,
      });
    }
  }, [profile, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* <FormField
          control={form.control}
          name="profileImg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Avatar className="h-24 w-24">
                  <AvatarImage src={field.value || ''} />
                  <AvatarFallback>{profile?.username}</AvatarFallback>
                </Avatar>
              </FormControl>
              <FormDescription>
                Click to upload a new profile picture
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled />
              </FormControl>
              <FormDescription>
                Your email address is used for sign in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  );
}
