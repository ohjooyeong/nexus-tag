'use client';

import GenericForm from '@/components/generic-form';
import { Button } from '@/components/ui/button';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import axios from 'axios';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { BirthPicker } from './birth-picker';
import dayjs from 'dayjs';
import useSignUp from '../../_hooks/use-login';
import { Icons } from '@/components/icons';

export type SignUpFormData = {
  email: string;
  username: string;
  birthdate: string;
  password: string;
  confirmPassword: string;
};

const AdditionalInfoForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [SignUpError, setSignUpError] = useState<string | null>(null);
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [open, setOpen] = useState(false); // 달력 on off state

  const signupMutation = useSignUp();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: email ?? '',
      username: '',
      birthdate: dayjs('2000-10-22').format('YYYY-MM-DD'),
      password: '',
      confirmPassword: '',
    },
  });

  const watchedEmail = watch('email');
  const watchedUsername = watch('username');
  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');
  const watchedBirthdate = watch('birthdate');

  const isEmail = watchedEmail && !errors.email;
  const isUsername = watchedUsername && !errors.username;
  const isPassword = watchedPassword && !errors.password;
  const isBirthdate = watchedBirthdate;
  const isSamePassword = watchedPassword === watchedConfirmPassword;

  const canStarted =
    !checkedTerms ||
    !isEmail ||
    !isUsername ||
    !isPassword ||
    !isBirthdate ||
    !isSamePassword;

  const onSubmit: SubmitHandler<SignUpFormData> = async (context) => {
    setIsLoading(true);
    setSignUpError(null); // 이전 에러 초기화
    try {
      const response = await signupMutation.mutateAsync({
        email: context.email,
        password: context.password,
        birthdate: context.birthdate,
        username: context.username,
      });
      if (response) {
        toast.info(
          'Email Verification Required. Check your email and the verification link to activate your account',
        );
        router.replace(`/login`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // AxiosError인 경우 처리
        const { status, data } = error.response;
        setSignUpError(
          data?.message || 'Invalid email or password. Please try again.',
        );
        console.error(`Error ${status}:`, data);
      } else {
        // 기타 에러 처리
        setSignUpError(null); // 이전 에러 초기화
        toast('An unknown error occurred.');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col flex justify-center items-center p-20 bg-blue-100/30">
      <div className="w-96 flex flex-col">
        <h3 className="text-3xl font-semibold mb-4">Almost there!</h3>
        <GenericForm<SignUpFormData>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={handleSubmit(onSubmit) as any}
        >
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email" className="font-semibold text-neutral-700">
                Email
              </Label>
              <Input
                id="email"
                placeholder=""
                type="email"
                autoCapitalize="none"
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
                    message: 'Invalid email. Please try again.',
                  },
                  required: 'Email must be provided.',
                })}
              />
              <p className="mt-2 text-sm text-neutral-400">{`Enter a valid email address (e.g., example@domain.com).`}</p>
            </div>
            <div>
              <Label
                htmlFor="password"
                className="font-semibold text-neutral-700"
              >
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
                      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/i,
                    message: 'Invalid password. Please try again.',
                  },
                  required: 'Password must be provided.',
                })}
              />
              <p className="mt-2 text-sm text-neutral-400">{`Use at least 8 characters with letters, numbers, and symbols.`}</p>
            </div>

            <div>
              <Label
                htmlFor="confirm-password"
                className="font-semibold text-neutral-700"
              >
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                placeholder=""
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                className={twMerge(
                  '',
                  errors.confirmPassword &&
                    'focus-visible:ring-transparent border-red-500',
                )}
                {...register('confirmPassword', {
                  validate: (value) =>
                    value === watchedPassword || 'Passwords do not match',
                  required: 'Please confirm your password',
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="username"
                className="font-semibold text-neutral-700"
              >
                Name
              </Label>
              <Input
                id="name"
                placeholder=""
                type="text"
                disabled={isLoading}
                className={twMerge(
                  '',
                  errors.username &&
                    'focus-visible:ring-transparent border-red-500',
                )}
                {...register('username', {
                  pattern: {
                    value: /^^[\w\s]{2,40}$/,
                    message:
                      'Name must be 2-40 characters long and only include letters and spaces.',
                  },
                  required: 'Name must be provided.',
                })}
              />
              <p className="mt-2 text-sm text-neutral-400">{`Enter your full name (max 40 characters).`}</p>
            </div>
            <div>
              <Label
                htmlFor="birthdate"
                className="font-semibold text-neutral-700"
              >
                Birthdate
              </Label>
              <Input
                id="birthdate"
                placeholder=""
                type="text"
                disabled={isLoading}
                {...register('birthdate')}
                readOnly
                onClick={() => setOpen(true)}
              />
            </div>
            <div className="w-full text-right mb-3">
              {(errors.email ||
                errors.password ||
                errors.username ||
                SignUpError) && (
                <p className="text-xs text-red-500">
                  {errors.email?.message ||
                    errors.password?.message ||
                    errors.username?.message ||
                    SignUpError}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={checkedTerms}
                onCheckedChange={(checked) => setCheckedTerms(!!checked)}
              />
              <Label htmlFor="terms" className="text-sm text-neutral-700">
                I have read and agree with the{' '}
                <a
                  href="/terms-of-service"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy-policy"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </Label>
            </div>
          </div>
          <Button
            className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
              transition mt-8"
            disabled={canStarted || isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {`Let's get started!`}
          </Button>
          <BirthPicker
            open={open}
            setOpen={setOpen}
            birth={watchedBirthdate}
            setValue={setValue}
          />
        </GenericForm>
      </div>
    </div>
  );
};

export default AdditionalInfoForm;
