'use client';

import { Button } from '@/components/ui/button';
import Pointer from '../_components/pointer';
import GenericForm from '@/components/generic-form';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type SignUpFormData = {
  email: string;
};

const Heroes = () => {
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
    <section className="py-24">
      <div className="container mx-auto relative">
        <div className="absolute left-56 top-96 hidden lg:block">
          <Pointer name="Andres" />
        </div>
        <div className="absolute right-80 -top-4 hidden lg:block">
          <Pointer name="Bryan" color="red" />
        </div>
        <div className="flex justify-center">
          <div
            className="inline-flex py-1 px-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full
              text-neutral-950 font-semibold"
          >
            ✨ The Future of AI Data Labeling
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-medium text-center mt-6">
          Smarter, Faster Data Labeling
          <br /> Great AI Models Start with Great Data
        </h1>
        <p className="text-center text-lg md:text-xl text-black/50 mt-8 max-w-4xl mx-auto">
          Elevate your data quality and accelerate model training with our
          cutting-edge AI labeling solution.
          <br />
          The new standard in data labeling—achieve more with less effort.
        </p>
        <GenericForm
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={
            handleSubmit(onSubmit, () => {
              // Error handler
              if (errors.email) {
                toast.error(errors.email.message);
              }
            }) as any
          }
        >
          <div
            className={cn(
              'flex border border-black/15 rounded-full p-2 mt-8 max-w-lg mx-auto',
              errors.email && 'border-red-500',
            )}
          >
            <input
              placeholder="Enter your email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="bg-transparent px-4 flex-1 outline-none"
              {...register('email', {
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                  message: 'Invalid email or password. Please try again.',
                },
                required: 'Email must be provided.',
              })}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="whitespace-nowrap rounded-full px-6"
              size={'sm'}
            >
              Sign Up
            </Button>
          </div>
        </GenericForm>
      </div>
    </section>
  );
};

export default Heroes;
