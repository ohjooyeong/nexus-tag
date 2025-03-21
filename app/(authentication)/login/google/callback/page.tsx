'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthToken } from '@/lib/auth';
import { toast } from 'sonner';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const expires_at = searchParams.get('expires_at');
    const expires_in = searchParams.get('expires_in');

    if (token) {
      try {
        // JWT 토큰 저장
        setAuthToken({
          access_token: token,
          expires_at: expires_at ? parseInt(expires_at) : 0, // 백엔드에서 받은 값으로 설정
          expires_in: expires_in ? parseInt(expires_in) : 0, // 백엔드에서 받은 값으로 설정
        });

        const redirect = searchParams.get('redirect') || '/workspaces';
        router.replace(redirect);
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('Failed to process Google login');
        router.replace('/login');
      }
    } else {
      toast.error('Invalid login response');
      router.replace('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          Processing Google Login...
        </h2>
        <p className="text-gray-500">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}
