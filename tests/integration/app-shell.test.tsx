import { render, screen } from '@testing-library/react';
import { AppShell } from '@/components/app-shell/app-shell';

test('app shell renders title and navigation slots', () => {
  render(<AppShell title="Dashboard">content</AppShell>);

  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  expect(screen.getByText('content')).toBeInTheDocument();
});
