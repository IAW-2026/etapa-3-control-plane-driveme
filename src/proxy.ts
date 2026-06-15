import { NextRequest, NextResponse } from 'next/server'

export default function proxy(req: NextRequest) {
  const auth = req.headers.get('authorization')

  if (auth?.startsWith('Basic ')) {
    const credentials = atob(auth.slice(6))
    const password = credentials.slice(credentials.indexOf(':') + 1)
    if (password === process.env.CONTROL_PLANE_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="DriveMe Control Plane"',
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
