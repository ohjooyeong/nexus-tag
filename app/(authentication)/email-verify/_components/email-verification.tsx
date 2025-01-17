'use client';

import { Spinner } from '@/components/spinner';
import axiosInstance from '@/config/axios-instance';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EmailVerification = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axiosInstance.post('/auth/verify-email', { token });
        setStatus('success');
        setTimeout(() => {
          router.replace('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
      }
    };

    if (!token) {
      setStatus('notfound');
      return;
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="flex-col flex justify-center items-center p-20">
      <div className="flex items-center justify-center">
        {status === 'loading' && (
          <div className="flex flex-col">
            <p className="mt-8 mb-4 text-lg text-gray-500">
              Verifying your email...
            </p>
            <div className="flex w-full justify-center items-center">
              <Spinner size={'lg'} />
            </div>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col">
            <p className="mt-8 mb-4 text-lg text-gray-500">
              Your email has been verified! Redirecting to the login page...
            </p>
            <div className="flex w-full justify-center items-center">
              <Spinner size={'lg'} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <>
            <p className="mt-8 mb-4 text-lg text-gray-500">
              Email verification failed. Please try again or request a new
              verification email.
            </p>
          </>
        )}
        {status === 'notfound' && (
          <p className="mt-8 mb-4 text-lg text-gray-500">
            Invalid or missing token. Please check your email for the correct
            link.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
