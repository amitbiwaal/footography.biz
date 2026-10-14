import 'server-only'
import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from './session'

export function adminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && (process.env.AUTH_SECRET?.length ?? 0) >= 32)
}

function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function checkCredentials(email: string, password: string) {
  if (!adminConfigured()) return false
  const emailOk = safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase())
  const passOk = safeEqual(password, process.env.ADMIN_PASSWORD!)
  return emailOk && passOk
}

export async function startSession(email: string) {
  const token = await signSession(email)
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function endSession() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export async function getSession() {
  const jar = await cookies()
  return verifySession(jar.get(SESSION_COOKIE)?.value)
}

/** Use at the top of every admin page, Server Action and admin API route. */
export async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

/* ------------------------- Simple in-memory throttle ------------------------- */

const buckets = new Map<string, { count: number; resetAt: number }>()

export async function clientIp() {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local'
}

/** Returns true when the action is allowed, false when the limit was hit. */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  bucket.count += 1
  return bucket.count <= limit
}

export function resetRateLimit(key: string) {
  buckets.delete(key)
}
