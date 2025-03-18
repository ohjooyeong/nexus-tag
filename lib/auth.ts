interface TokenData {
  access_token: string;
  expires_at: number;
  expires_in: number;
}

export const setAuthToken = (tokenData: TokenData) => {
  // localStorage에 저장
  localStorage.setItem('auth_token', tokenData.access_token);
  localStorage.setItem('token_expires_at', tokenData.expires_at.toString());

  // 쿠키에도 저장
  document.cookie = `auth_token=${tokenData.access_token}; path=/; max-age=${tokenData.expires_in}`;
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token_expires_at');
};

export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('token_expires_at');
  if (!expiresAt) return true;
  return Date.now() >= parseInt(expiresAt);
};
