import axiosInstance from '@/config/axios-instance';
import { userQueries } from '@/constants/querykey-factory';
import { useQuery } from '@tanstack/react-query';

export interface ProfileData {
  id: string;
  email: string;
  username: string;
  birthdate: string | null;
  isEmailVerified: boolean;
  providerId: string;
  provider: 'google' | 'local';
  createdAt: string;
  updatedAt: string;
  profile: {
    profileImg: string | null;
  };
  defaultWorkspace: {
    id: string;
    name: string;
    description: string;
    plan: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function useProfile() {
  const { isLoading, isError, data } = useQuery({
    queryKey: userQueries.profile(),
    queryFn: async () => {
      const { data } = await axiosInstance.get('/user/profile');
      return data.data as ProfileData;
    },

    staleTime: 0,
  });

  const isGoogleProvider = data?.provider === 'google';

  return { isLoading, isError, data, isGoogleProvider };
}
