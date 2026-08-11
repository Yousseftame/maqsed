import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Placeholder for Next.js 16 Proxy approach route protection
// using Firebase Auth. We will implement the actual logic later.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip internal Next.js paths and static files
    '/((?!_next/static|_next/image|favicon.ico|lgoogg.png).*)',
  ],
};