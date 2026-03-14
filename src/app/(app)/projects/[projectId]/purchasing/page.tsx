import { notFound } from 'next/navigation';
import { PurchasingTable } from '@/components/purchasing/purchasing-table';
import { PurchasingWorkflowForm } from '@/components/purchasing/purchasing-workflow-form';
import { getProjectDetail } from '@/server/actions/projects';
import { getPurchasingView } from '@/server/actions/purchasing';

type PurchasingPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function PurchasingPage({ params }: PurchasingPageProps) {
  const { projectId } = await params;
  const project = await getProjectDetail(projectId);

  if (!project) {
    notFound();
  }

  const rows = await getPurchasingView(project.id);

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Purchasing section
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>{project.name} purchasing</h1>
      </div>
      <PurchasingWorkflowForm canEdit />
      <PurchasingTable rows={rows} />
    </section>
  );
}
