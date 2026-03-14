import { createDemoSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { resetDatabaseForTest } from '../helpers/db';

test('demo login resolves a persisted user by email', async () => {
  await resetDatabaseForTest();
  const persistedUser = await db.user.findUniqueOrThrow({
    where: {
      email: 'designer@demo.local',
    },
  });

  const session = await createDemoSession({ email: 'designer@demo.local' });

  expect(session.userEmail).toBe('designer@demo.local');
  expect(session.role).toBe('designer');
  expect(session.userId).toBe(persistedUser.id);
});
