import { ProjectsTable } from '@/components/projects/projects-table';
import { DEMO_PROJECTS } from '@/lib/demo-projects';

export default function ProjectsPage() {
  return <ProjectsTable projects={DEMO_PROJECTS} />;
}
