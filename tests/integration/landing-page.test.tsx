import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

test('landing page shows feature messaging and login cta', () => {
  render(<HomePage />);

  expect(screen.getByRole('heading', { name: /centralized bom management/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login');
});
