import { Metadata } from 'next';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from './_components/user-auth-form';
import { Cloud } from 'lucide-react';
import EtcLink from '../_components/etc-link';
import AuthenticationImage from '../_components/authentication-image';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login',
};

export default function AuthenticationPage() {
  return (
    <>
      <AuthenticationImage />
      <div
        className="px-3 flex lg:container relative h-full flex-col items-center justify-center
          md:grid lg:max-w-none lg:grid-cols-2 md:px-0"
      >
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8',
          )}
        >
          Sign Up
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Cloud className="h-8 w-8 mr-3" />
            Nexus Tag
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to Nexus Tag
              </h1>
              <div className="flex items-center gap-2 justify-center">
                <p className="text-sm text-muted-foreground">
                  New to Nexus Tag?
                </p>
                <Link href={'/signup'} className="text-sm text-blue-600">
                  Create an account
                </Link>
              </div>
            </div>
            <UserAuthForm />
            <EtcLink />
          </div>
        </div>
      </div>
    </>
  );
}
