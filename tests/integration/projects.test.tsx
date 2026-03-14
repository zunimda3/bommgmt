import { db } from '@/lib/db';
import { createProject, createProjectModule, visibleProjectsForUser } from '@/server/actions/projects';
import { resetDatabaseForTest } from '../helpers/db';

test('designer sees only assigned persisted projects', async () => {
  await resetDatabaseForTest();
  const designer = await db.user.findUniqueOrThrow({
    where: {
      email: 'designer@demo.local',
    },
  });

  const projects = await visibleProjectsForUser({
    user: { id: designer.id, role: 'designer' },
  });

  expect(projects).toHaveLength(1);
  expect(projects[0]?.code).toBe('PRJ-1001');
});

test('admin can create a project with assignments', async () => {
  await resetDatabaseForTest();
  const [admin, designer, purchaser] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { email: 'admin@demo.local' } }),
    db.user.findUniqueOrThrow({ where: { email: 'designer@demo.local' } }),
    db.user.findUniqueOrThrow({ where: { email: 'purchaser@demo.local' } }),
  ]);

  const project = await createProject({
    actor: { id: admin.id, role: 'admin' },
    input: {
      code: 'PRJ-2001',
      name: 'New Line',
      description: 'New line build',
      status: 'active',
      designerId: designer.id,
      purchaserId: purchaser.id,
    },
  });

  const persistedProject = await db.project.findUnique({
    where: {
      code: 'PRJ-2001',
    },
  });

  expect(project.code).toBe('PRJ-2001');
  expect(persistedProject?.name).toBe('New Line');
});

test('designer can create a module inside an assigned project', async () => {
  await resetDatabaseForTest();
  const designer = await db.user.findUniqueOrThrow({
    where: {
      email: 'designer@demo.local',
    },
  });
  const project = await db.project.findUniqueOrThrow({
    where: {
      code: 'PRJ-1001',
    },
  });

  const module = await createProjectModule({
    actor: { id: designer.id, role: 'designer' },
    projectId: project.id,
    input: { name: 'Guarding' },
  });

  const persistedModule = await db.projectModule.findUnique({
    where: {
      projectId_name: {
        projectId: project.id,
        name: 'Guarding',
      },
    },
  });

  expect(module.name).toBe('Guarding');
  expect(persistedModule?.name).toBe('Guarding');
});
