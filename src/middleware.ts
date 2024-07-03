import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  if (isApiRoute) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (isAdminRoute && (!req.auth?.user || !req.auth.user.isAdmin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  if (isAdminRoute) {
    if (!isLoggedIn || (req.auth?.user && !req.auth.user.isAdmin)) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}