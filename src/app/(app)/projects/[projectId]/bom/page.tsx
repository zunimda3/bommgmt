import { notFound } from 'next/navigation';
import { BomItemForm } from '@/components/bom/bom-item-form';
import { ModuleForm } from '@/components/bom/module-form';
import { ModuleTable } from '@/components/bom/module-table';
import { getCurrentUser } from '@/lib/auth/current-user';
import { canEditBom, canManageModules } from '@/lib/permissions';
import { getProjectDetail } from '@/server/actions/projects';

type BomPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function BomPage({ params }: BomPageProps) {
  const { projectId } = await params;
  const [project, currentUser] = await Promise.all([getProjectDetail(projectId), getCurrentUser()]);

  if (!project) {
    notFound();
  }

  const isAssigned = currentUser
    ? project.designerId === currentUser.userId || project.purchaserId === currentUser.userId
    : false;
  const canEdit = currentUser
    ? canEditBom({
        role: currentUser.role,
        isAssigned,
      })
    : false;
  const canManageModule = currentUser
    ? canManageModules({
        role: currentUser.role,
        isAssigned,
      })
    : false;

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          BOM section
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>{project.name} BOM</h1>
      </div>
      <ModuleForm canManage={canManageModule} projectId={project.id} />
      <BomItemForm
        canEdit={canEdit}
        modules={project.modules.map((module) => ({
          id: module.id,
          name: module.name,
        }))}
        projectId={project.id}
      />
      {project.modules.map((module) => (
        <ModuleTable key={module.id} module={module} />
      ))}
    </section>
  );
}
