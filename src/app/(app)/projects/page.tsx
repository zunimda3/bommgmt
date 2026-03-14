import { ProjectsTable } from '@/components/projects/projects-table';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { visibleProjectsForUser } from '@/server/actions/projects';

export default async function ProjectsPage() {
  const user = await requireCurrentUser();
  const projects = await visibleProjectsForUser({
    user: {
      id: user.userId,
      role: user.role,
    },
  });

  return <ProjectsTable projects={projects} />;
}
