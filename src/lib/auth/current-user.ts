import { getSession } from '@/lib/auth/session';

export async function getCurrentUser() {
  try {
    return await getSession();
  } catch {
    return null;
  }
}

export async function requireCurrentUser() {
  const session = await getCurrentUser();

  if (!session) {
    throw new Error('Authentication required');
  }

  return session;
}
