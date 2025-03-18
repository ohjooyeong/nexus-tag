import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const publicRoutes = ['/', '/login', '/signup'];
export const protectedRoutes = [/^\/workspaces(\/.*)?$/, /^\/settings(\/.*)?$/];

function redirectToLogin(request: NextRequest, redirectPath: string) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', redirectPath);
  return NextResponse.redirect(loginUrl);
}

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
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
        throw new Error('NEXT_PUBLIC_API_URL environment variable is not set.');
      }

      // 서버에서 토큰 유효성 검증
      const response = await fetch(`${apiUrl}/auth/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await response.json();

      if (!data.loggedIn) {
        return redirectToLogin(request, currentPath);
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      return redirectToLogin(request, currentPath);
    }
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/workspaces', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
