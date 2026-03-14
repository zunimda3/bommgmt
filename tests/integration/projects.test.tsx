import { db } from '@/lib/db';
import { visibleProjectsForUser } from '@/server/actions/projects';
import { resetDatabaseForTest } from '../helpers/db';

test('designer sees only assigned persisted projects', async () => {
  await resetDatabaseForTest();
  const designer = await db.user.findUniqueOrThrow({
    where: {
      email: 'designer@demo.local',
    },
  });

  const projects = await visibleProjectsForUser({
    user: { id: designer.id, role: 'designer' },
  });

  expect(projects).toHaveLength(1);
  expect(projects[0]?.code).toBe('PRJ-1001');
});
