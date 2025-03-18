import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/config/axios-instance';
import { removeAuthToken } from '@/lib/auth';

export const useLogout = () => {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');

      // 백엔드 로그아웃 요청
      await axiosInstance.post('/auth/logout');

      // 클라이언트 측 토큰 제거
      removeAuthToken();

      // 쿠키 제거 (만약 쿠키도 사용중이라면)
      document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      // 로그인 페이지로 리다이렉트
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);

      // 에러가 발생하더라도 클라이언트 측 데이터는 정리
      removeAuthToken();
      document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/login');

      throw error;
    }
  }, [router]);

  return { logout };
};
