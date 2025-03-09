'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import GenericForm from '@/components/generic-form';
import { twMerge } from 'tailwind-merge';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type SignUpFormData = {
  email: string;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
    },
  });

  const email = watch('email');

  async function onSubmit() {
    setIsLoading(true);

    setTimeout(() => {
      router.push(`/signup/additional-info?email=${email}`);
      setIsLoading(false);
    }, 2000);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <GenericForm onSubmit={handleSubmit(onSubmit) as any}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email" className="ml-1 text-neutral-500">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className={twMerge(
                '',
                errors.email && 'focus-visible:ring-transparent border-red-500',
              )}
              {...register('email', {
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                  message: 'Invalid email or password. Please try again.',
                },
                required: 'Email must be provided.',
              })}
            />
            <div className="w-full text-right mt-1 mb-1">
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email?.message}</p>
              )}
            </div>
          </div>
          <Button
            disabled={isLoading}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
              transition"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
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
