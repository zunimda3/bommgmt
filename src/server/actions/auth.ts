'use server';

import { redirect } from 'next/navigation';
import { clearSession, createDemoSession, persistSessionCookie } from '@/lib/auth/session';

export async function loginDemoUser(formData: FormData) {
  const email = formData.get('email');

  if (typeof email !== 'string' || !email) {
    throw new Error('Demo user email is required');
  }

  const session = await createDemoSession({ email });
  await persistSessionCookie(session);

  redirect('/dashboard');
}

export async function logout() {
  await clearSession();
  redirect('/login');
}
