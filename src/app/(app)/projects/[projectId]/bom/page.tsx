import { notFound } from 'next/navigation';
import { BomItemForm } from '@/components/bom/bom-item-form';
import { ModuleTable } from '@/components/bom/module-table';
import { getProjectDetail } from '@/server/actions/projects';

type BomPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function BomPage({ params }: BomPageProps) {
  const { projectId } = await params;
  const project = await getProjectDetail(projectId);

  if (!project) {
    notFound();
  }

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          BOM section
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>{project.name} BOM</h1>
      </div>
      <BomItemForm canEdit />
      {project.modules.map((module) => (
        <ModuleTable key={module.id} module={module} />
      ))}
    </section>
  );
}
