import { cookies } from 'next/headers';
import { findDemoUserByEmail, type DemoRole } from '@/lib/demo-users';

export const SESSION_COOKIE_NAME = 'bommgmt_session';

export type SessionPayload = {
  role: DemoRole;
  userEmail: string;
  userId: string;
  userName: string;
};

export async function createDemoSession({ email }: { email: string }): Promise<SessionPayload> {
  const user = findDemoUserByEmail(email);

  if (!user) {
    throw new Error(`Unknown demo user: ${email}`);
  }

  return {
    role: user.role,
    userEmail: user.email,
    userId: user.id,
    userName: user.name,
  };
}

export function encodeSession(session: SessionPayload) {
  return Buffer.from(JSON.stringify(session)).toString('base64url');
}

export function decodeSession(value: string) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as SessionPayload;
}

export async function persistSessionCookie(session: SessionPayload) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    return decodeSession(sessionCookie.value);
  } catch {
    return null;
  }
}
