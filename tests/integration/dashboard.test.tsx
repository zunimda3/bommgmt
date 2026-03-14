import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(app)/dashboard/page';

test('dashboard renders the owner announcement area', () => {
  render(<DashboardPage />);

  expect(screen.getByText(/announcement/i)).toBeInTheDocument();
});
