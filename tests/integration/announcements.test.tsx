import { render, screen } from '@testing-library/react';
import AnnouncementsPage from '@/app/(app)/announcements/page';
import { resetDatabaseForTest } from '../helpers/db';

test('announcements page lists persisted announcement titles', async () => {
  await resetDatabaseForTest();

  render(await AnnouncementsPage());

  expect(screen.getByRole('heading', { name: /announcements/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /quarter kickoff/i })).toBeInTheDocument();
});
