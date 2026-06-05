import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'cf_admin_session'

// Allow only US traffic (and internal/undetectable geo)
// Vercel sets the x-vercel-ip-country header automatically
const ALLOWED_COUNTRIES = new Set(['US', '', 'XX', 'T1']) // T1 = Tor, XX = unknown — allow rather than false-block legit US VPN users

// Block known bad bot user agents
const BOT_UA_PATTERNS = [
  /ahrefsbot/i,
  /semrushbot/i,
  /dotbot/i,
  /mj12bot/i,
  /blexbot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /claudebot/i,
  /ccbot/i,
  /scrapy/i,
  /python-requests/i,
  /go-http-client/i,
  /curl\//i,
  /wget\//i,
  /zgrab/i,
  /masscan/i,
]

function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [version, expiresAtStr] = parts
    if (version !== 'v1') return false
    const expiresAt = parseInt(expiresAtStr, 10)
    if (!expiresAt || expiresAt < Date.now()) return false
    return true
  } catch {
    return false
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Bot UA blocking (applies everywhere) ─────────────────────────────────
  const ua = req.headers.get('user-agent') || ''
  if (BOT_UA_PATTERNS.some(p => p.test(ua))) {
    return new NextResponse(null, { status: 403 })
  }

  // ── Geo-blocking: US only (skip for admin, API, static assets) ───────────
  const skipGeo =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'

  if (!skipGeo) {
    const country = req.headers.get('x-vercel-ip-country') || ''
    if (country && !ALLOWED_COUNTRIES.has(country)) {
      // Return a minimal 403 — don't waste bandwidth on scrapers
      return new NextResponse('Not available in your region.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      })
    }
  }

  // ── Admin auth gate ───────────────────────────────────────────────────────
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!isValidSessionToken(token)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
