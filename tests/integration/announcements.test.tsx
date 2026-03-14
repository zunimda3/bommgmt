import { render, screen } from '@testing-library/react';
import AnnouncementsPage from '@/app/(app)/announcements/page';

test('announcements page lists announcement titles', () => {
  render(<AnnouncementsPage />);

  expect(screen.getByRole('heading', { name: /announcements/i })).toBeInTheDocument();
});
