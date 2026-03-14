import { render, screen } from '@testing-library/react';
import ProjectDetailPage from '@/app/(app)/projects/[projectId]/page';

test('project detail page shows team list and section links', async () => {
  render(await ProjectDetailPage({ params: Promise.resolve({ projectId: 'project-1' }) }));

  expect(screen.getByText(/team list/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /bom/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /purchasing/i })).toBeInTheDocument();
});
