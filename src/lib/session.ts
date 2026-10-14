import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'fb_admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secretKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters.')
  }
  return new TextEncoder().encode(secret)
}

export async function signSession(email: string) {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey())
}

export async function verifySession(token: string | undefined) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    if (payload.role !== 'admin' || !payload.sub) return null
    return { email: payload.sub }
  } catch {
    return null
  }
}
