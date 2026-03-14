import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(app)/dashboard/page';
import { resetDatabaseForTest } from '../helpers/db';

test('dashboard renders persisted announcement content', async () => {
  await resetDatabaseForTest();

  render(await DashboardPage());

  expect(screen.getByText(/quarter kickoff/i)).toBeInTheDocument();
});
