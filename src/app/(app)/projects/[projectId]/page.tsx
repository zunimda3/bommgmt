import { notFound } from 'next/navigation';
import { ProjectOverview } from '@/components/projects/project-overview';
import { TeamList } from '@/components/projects/team-list';
import { getProjectDetail } from '@/server/actions/projects';

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = await getProjectDetail(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <TeamList
        designerName={project.designer?.name ?? 'Unassigned'}
        purchaserName={project.purchaser?.name ?? 'Unassigned'}
      />
      <ProjectOverview project={project} />
    </div>
  );
}
