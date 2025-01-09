'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import GenericForm from '@/components/generic-form';
import { SubmitHandler, useForm } from 'react-hook-form';
import useLogin from '../_hooks/use-login';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type LoginFormData = {
  email: string;
  password: string;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    setValue,
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
    setIsLoading(true); // 로딩 상태 시작
    setLoginError(null); // 이전 에러 초기화
    try {
      const response = await loginMutation.mutateAsync({
        email: context.email,
        password: context.password,
      });
      console.log(response); // 성공적으로 로그인한 경우의 처리
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // AxiosError인 경우 처리
        const { status, data } = error.response;
        setLoginError(
          data?.message || 'Invalid email or password. Please try again.',
        );
        console.error(`Error ${status}:`, data);
      } else {
        // 기타 에러 처리
        setLoginError(null); // 이전 에러 초기화
        toast('An unknown error occurred.');
        console.error(error);
      }
    } finally {
      setIsLoading(false); // 로딩 상태 종료
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
