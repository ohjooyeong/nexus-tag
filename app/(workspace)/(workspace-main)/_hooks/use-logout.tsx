import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/config/axios-instance';

export const useLogout = () => {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      const { data } = await axiosInstance.post('/auth/logout');

      if (data.statusCode === 200) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [router]);

  return { logout };
};
