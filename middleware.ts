import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 불필요
export const publicRoutes = ['/', '/login', '/signup'];

// 로그인 필요
export const protectedRoutes = [/^\/workspaces(\/.*)?$/, /^\/settings(\/.*)?$/];

function redirectToLogin(request: NextRequest, redirectPath: string) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', redirectPath);
  return NextResponse.redirect(loginUrl);
}

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('Authentication')?.value; // 쿠키에서 토큰 추출
  const currentPath = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(currentPath);
  const isProtectedRoute = protectedRoutes.some((route) =>
    route.test(currentPath),
  );

  if (isProtectedRoute) {
    if (!token) {
      return redirectToLogin(request, currentPath);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.');
      }

      // 서버에서 토큰 유효성 검증
      const response = await fetch(`${apiUrl}/auth/status`, {
        headers: { Cookie: `Authentication=${token}` },
      });

      const { data } = await response.json();
      // console.log(data);
      if (!data.loggedIn) {
        return redirectToLogin(request, currentPath);
      }
    } catch (error) {
      console.error('Token validation failed:', error);

      return redirectToLogin(request, currentPath);
    }
  }

  // 로그인 상태로 공용 라우트에 접근할 때
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/workspaces', request.url)); // 로그인 후 기본 페이지로 리다이렉트
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // API 및 정적 파일 제외
};
