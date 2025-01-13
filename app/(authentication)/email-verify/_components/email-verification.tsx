'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

const EmailVerification = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  return (
    <div className="flex-col flex justify-center items-center mt-8 p-20">
      <div className="w-96 flex flex-col">
        <div className="flex justify-center mb-4">
          <div className="text-center text-xl font-semibold text-red-500">
            Email Verification Required
          </div>
        </div>
        <p className="mt-8 mb-4 text-sm text-gray-500">
          {`Please check your email and verify your account. If you don't see our
          email, check your spam folder.`}
        </p>
        <div className="w-full h-11 flex items-center justify-center rounded-sm mt-8 bg-slate-300">
          <span className="text-lg font-semibold text-black">{email}</span>
        </div>

        <Button
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
            transition mt-4"
          onClick={() => router.replace('/login')}
        >{`I've already verified`}</Button>
        <Button variant={'outline'} className="mt-4">{`Resend Email`}</Button>
      </div>
    </div>
  );
};

export default EmailVerification;
