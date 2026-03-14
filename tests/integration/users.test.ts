import { db } from '@/lib/db';
import { createUser } from '@/server/actions/users';
import { resetDatabaseForTest } from '../helpers/db';

test('owner can create a persisted user', async () => {
  await resetDatabaseForTest();
  const owner = await db.user.findUniqueOrThrow({
    where: {
      email: 'owner@demo.local',
    },
  });

  const user = await createUser({
    actor: { role: 'owner', id: owner.id },
    input: {
      name: 'New Designer',
      email: 'new.designer@demo.local',
      role: 'designer',
    },
  });

  const persistedUser = await db.user.findUnique({
    where: {
      email: 'new.designer@demo.local',
    },
  });

  expect(user.email).toBe('new.designer@demo.local');
  expect(persistedUser?.name).toBe('New Designer');
});

test('admin cannot create users', async () => {
  await resetDatabaseForTest();
  const admin = await db.user.findUniqueOrThrow({
    where: {
      email: 'admin@demo.local',
    },
  });

  await expect(
    createUser({
      actor: { role: 'admin', id: admin.id },
      input: {
        name: 'New Purchaser',
        email: 'new.purchaser@demo.local',
        role: 'purchaser',
      },
    }),
  ).rejects.toThrow(/owner only/i);
});
