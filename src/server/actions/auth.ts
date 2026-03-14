'use server';

import { redirect } from 'next/navigation';
import { clearSession, createDemoSession, persistSessionCookie } from '@/lib/auth/session';
import { demoLoginSchema } from '@/lib/validators/auth';

export async function loginDemoUser(formData: FormData) {
  const parsed = demoLoginSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    throw new Error('Demo user email is required');
  }

  const session = await createDemoSession({ email: parsed.data.email });
  await persistSessionCookie(session);

  redirect('/dashboard');
}

export async function logout() {
  await clearSession();
  redirect('/login');
}
