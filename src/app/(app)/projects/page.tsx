import { ProjectForm } from '@/components/projects/project-form';
import { ProjectsTable } from '@/components/projects/projects-table';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { canManageProjects } from '@/lib/permissions';
import { visibleProjectsForUser } from '@/server/actions/projects';
import { listUsers } from '@/server/actions/users';

export default async function ProjectsPage() {
  const user = await requireCurrentUser();
  const [projects, users] = await Promise.all([
    visibleProjectsForUser({
      user: {
        id: user.userId,
        role: user.role,
      },
    }),
    listUsers(),
  ]);

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <ProjectForm assignmentOptions={users} canManage={canManageProjects(user.role)} />
      <ProjectsTable projects={projects} />
    </section>
  );
}
