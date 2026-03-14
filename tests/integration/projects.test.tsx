import { visibleProjectsForUser } from '@/server/actions/projects';

test('designer only receives assigned projects', async () => {
  const projects = await visibleProjectsForUser({
    user: { id: 'designer-demo-user', role: 'designer' },
  });

  expect(projects.every((project) => project.designerId === 'designer-demo-user')).toBe(true);
});
