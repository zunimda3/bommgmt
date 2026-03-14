import { userInputSchema } from '@/lib/validators/users';
import { resetDatabaseForTest } from '../helpers/db';
import { getSeedUserEmails } from '../../prisma/seed';

test('seed exposes the demo users for each role', () => {
  expect(getSeedUserEmails()).toEqual([
    'owner@demo.local',
    'admin@demo.local',
    'designer@demo.local',
    'purchaser@demo.local',
  ]);
});

test('user validator rejects an invalid role', () => {
  expect(() =>
    userInputSchema.parse({
      email: 'demo@local',
      name: 'Bad Role',
      role: 'not-a-role',
    }),
  ).toThrow();
});

test('database reset helper reseeds demo users', async () => {
  const state = await resetDatabaseForTest();

  expect(state.userEmails).toContain('owner@demo.local');
});
