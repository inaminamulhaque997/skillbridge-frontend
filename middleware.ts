import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Note: Authentication is handled by protected-layout.tsx using localStorage
// Middleware cannot reliably check auth via cookies due to cross-origin limitations
// (Frontend and Backend are on different Vercel domains)

export function middleware(request: NextRequest) {
  // Allow all requests through - auth is handled client-side by protected-layout.tsx
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}