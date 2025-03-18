'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import GenericForm from '@/components/generic-form';
import { SubmitHandler, useForm } from 'react-hook-form';
import useLogin from '../_hooks/use-login';
import axios from 'axios';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { setAuthToken } from '@/lib/auth';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type LoginFormData = {
  email: string;
  password: string;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,

    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useLogin();

  const onSubmit: SubmitHandler<LoginFormData> = async (context) => {
    setIsLoading(true);
    setLoginError(null); // 이전 에러 초기화
    try {
      const data = await loginMutation.mutateAsync({
        email: context.email,
        password: context.password,
      });
      setAuthToken(data);

      const redirect = searchParams.get('redirect');

      if (redirect) {
        router.replace(redirect);
        return;
      }

      router.replace('/workspaces');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // AxiosError인 경우 처리
        const { status, data } = error.response;
        if (status === 450) {
          toast.error(data?.message || 'Email Verification Required');
        } else {
          setLoginError(
            data?.message || 'Invalid email or password. Please try again.',
          );
        }

        console.error(`Error ${status}:`, data);
      } else {
        // 기타 에러 처리
        setLoginError(null); // 이전 에러 초기화
        toast('Login failed');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <GenericForm<LoginFormData>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSubmit={handleSubmit(onSubmit) as any}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <div>
              <Label htmlFor="email" className="ml-1 text-neutral-500">
                Email
              </Label>
              <Input
                id="email"
                placeholder=""
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className={twMerge(
                  '',
                  errors.email &&
                    'focus-visible:ring-transparent border-red-500',
                )}
                {...register('email', {
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                    message: 'Invalid email or password. Please try again.',
                  },
                  required: 'Email and password must be provided.',
                })}
              />
            </div>
            <div>
              <Label htmlFor="password" className="ml-1 text-neutral-500">
                Password
              </Label>
              <Input
                id="password"
                placeholder=""
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                className={twMerge(
                  '',
                  errors.password &&
                    'focus-visible:ring-transparent border-red-500',
                )}
                {...register('password', {
                  pattern: {
                    value:
                      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/i,
                    message: 'Invalid email or password. Please try again.',
                  },
                  required: 'Email and password must be provided.',
                })}
              />
            </div>
            <div className="w-full text-right mt-1 mb-1">
              {(errors.email || errors.password || loginError) && (
                <p className="text-sm text-red-500">
                  {errors.email?.message ||
                    errors.password?.message ||
                    loginError}
                </p>
              )}
            </div>
          </div>
          <Button
            disabled={isLoading}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
              transition"
            type="submit"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </GenericForm>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Button>
    </div>
  );
}
