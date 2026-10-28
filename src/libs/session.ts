import 'server-only'
import { cookies } from 'next/headers'
import {errors, JWTPayload, jwtVerify, SignJWT} from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

const sessionDuration = 7 * 24 * 60 * 60 * 1000

export async function encrypt(payload: JWTPayload, expiresAt = new Date(Date.now() + sessionDuration)) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    if (typeof payload.accessToken !== 'string' || !payload.accessToken) return null
    return payload
  } catch (error) {
    if (!(error instanceof errors.JWTExpired)) {
      console.error('Failed to verify session:', error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
}

export async function createSession(accessToken: string) {
  const expiresAt = new Date(Date.now() + sessionDuration)
  const session = await encrypt({ accessToken, expiresAt }, expiresAt)
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
