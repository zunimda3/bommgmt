import { db } from '@/lib/db';
import { createAnnouncement } from '@/server/actions/announcements';
import { resetDatabaseForTest } from '../helpers/db';

test('owner can create a persisted announcement', async () => {
  await resetDatabaseForTest();
  const owner = await db.user.findUniqueOrThrow({
    where: {
      email: 'owner@demo.local',
    },
  });

  const announcement = await createAnnouncement({
    actor: { role: 'owner', id: owner.id },
    input: { title: 'Database-backed update', body: 'This announcement should be saved.' },
  });

  const persistedAnnouncement = await db.announcement.findUnique({
    where: {
      id: announcement.id,
    },
  });

  expect(announcement.title).toBe('Database-backed update');
  expect(persistedAnnouncement?.body).toBe('This announcement should be saved.');
});

test('designer cannot create announcements', async () => {
  await resetDatabaseForTest();
  const designer = await db.user.findUniqueOrThrow({
    where: {
      email: 'designer@demo.local',
    },
  });

  await expect(
    createAnnouncement({
      actor: { role: 'designer', id: designer.id },
      input: { title: 'Notice', body: 'Body' },
    }),
  ).rejects.toThrow(/not authorized/i);
});
