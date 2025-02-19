import { Role } from '@/app/(workspace)/(workspace-main)/_types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { memberQueries } from '@/constants/querykey-factory';
import axios from 'axios';
import useUpdateMember from '../../_hooks/use-update-member';

const memberFormSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Please select a valid role.' }),
  }),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;

const UpdateMemberSheet = ({
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { email: defaultEmail, role: defaultRole } = data;

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      email: defaultEmail,
      role: defaultRole,
    },
  });

  const updateMemberMutation = useUpdateMember();

  const onSubmit = async (data: MemberFormValues) => {
    setIsLoading(true);
    try {
      const response = await updateMemberMutation.mutateAsync({
        email: data.email,
        role: data.role,
        workspaceId: workspaceId as string,
      });
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: memberQueries.default() });
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Member</SheetTitle>
          <SheetDescription>
            Update a member to the workspace by selecting their role. Below you
            can see the privileges this user will have.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add a email"
                      {...field}
                      disabled={true}
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
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={defaultRole}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-sm">
                      <SelectItem value={Role.MANAGER}>
                        {Role.MANAGER}
                      </SelectItem>
                      <SelectItem value={Role.WORKER}>{Role.WORKER}</SelectItem>
                      {/* <SelectItem value={Role.REVIEWER}>
                        {Role.REVIEWER}
                      </SelectItem>
                      <SelectItem value={Role.VIEWER}>{Role.VIEWER}</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
                transition"
              disabled={isLoading || defaultRole === form.getValues('role')}
            >
              Update Member
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateMemberSheet;
