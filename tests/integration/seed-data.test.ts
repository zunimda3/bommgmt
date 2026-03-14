import { getSeedUserEmails } from '../../prisma/seed';

test('seed exposes the demo users for each role', () => {
  expect(getSeedUserEmails()).toEqual([
    'owner@demo.local',
    'admin@demo.local',
    'designer@demo.local',
    'purchaser@demo.local',
  ]);
});
