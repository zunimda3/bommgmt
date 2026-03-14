import { createDemoSession } from '@/lib/auth/session';

test('createDemoSession returns a session payload for a seeded user', async () => {
  const session = await createDemoSession({ email: 'owner@demo.local' });

  expect(session.userEmail).toBe('owner@demo.local');
  expect(session.role).toBe('owner');
});
