import { notFound } from 'next/navigation';
import { PurchasingTable } from '@/components/purchasing/purchasing-table';
import { PurchasingWorkflowForm } from '@/components/purchasing/purchasing-workflow-form';
import { getCurrentUser } from '@/lib/auth/current-user';
import { canEditPurchasing } from '@/lib/permissions';
import { getProjectDetail } from '@/server/actions/projects';
import { getPurchasingView } from '@/server/actions/purchasing';

type PurchasingPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function PurchasingPage({ params }: PurchasingPageProps) {
  const { projectId } = await params;
  const [project, currentUser] = await Promise.all([getProjectDetail(projectId), getCurrentUser()]);

  if (!project) {
    notFound();
  }

  const rows = await getPurchasingView(project.id);
  const isAssigned = currentUser
    ? project.designerId === currentUser.userId || project.purchaserId === currentUser.userId
    : false;
  const canEdit = currentUser
    ? canEditPurchasing({
        role: currentUser.role,
        isAssigned,
      })
    : false;

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Purchasing section
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>{project.name} purchasing</h1>
      </div>
      <PurchasingWorkflowForm
        canEdit={canEdit}
        projectId={project.id}
        rows={rows.map((row) => ({
          aggregateKey: row.aggregateKey,
          partNumber: row.partNumber,
        }))}
      />
      <PurchasingTable rows={rows} />
    </section>
  );
}
