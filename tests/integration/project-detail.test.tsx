import { render, screen } from '@testing-library/react';
import BomPage from '@/app/(app)/projects/[projectId]/bom/page';
import ProjectDetailPage from '@/app/(app)/projects/[projectId]/page';
import { db } from '@/lib/db';
import { resetDatabaseForTest } from '../helpers/db';

test('project detail page shows team list and section links', async () => {
  await resetDatabaseForTest();
  const project = await db.project.findUniqueOrThrow({
    where: {
      code: 'PRJ-1001',
    },
  });

  render(await ProjectDetailPage({ params: Promise.resolve({ projectId: project.id }) }));

  expect(screen.getByText(/team list/i)).toBeInTheDocument();
  expect(screen.getByText(/designer: daniel designer/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /bom/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /purchasing/i })).toBeInTheDocument();
});

test('bom page renders persisted module items', async () => {
  await resetDatabaseForTest();
  const project = await db.project.findUniqueOrThrow({
    where: {
      code: 'PRJ-1001',
    },
  });

  render(await BomPage({ params: Promise.resolve({ projectId: project.id }) }));

  expect(screen.getByText(/conveyor frame/i)).toBeInTheDocument();
  expect(screen.getByText('CF-100')).toBeInTheDocument();
});
