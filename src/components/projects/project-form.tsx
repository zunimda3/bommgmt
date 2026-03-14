import { createProjectFromForm } from '@/server/actions/projects';

type ProjectFormProps = {
  assignmentOptions: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  canManage: boolean;
};

export function ProjectForm({ assignmentOptions, canManage }: ProjectFormProps) {
  if (!canManage) {
    return null;
  }

  const designerOptions = assignmentOptions.filter((user) => user.role === 'designer');
  const purchaserOptions = assignmentOptions.filter((user) => user.role === 'purchaser');

  return (
    <form
      action={createProjectFromForm}
      style={{
        display: 'grid',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: '1.25rem',
        background: 'rgba(255, 250, 242, 0.94)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h2 style={{ margin: 0 }}>Create project</h2>
      <input aria-label="Project code" name="code" placeholder="PRJ-2001" required style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="text" />
      <input aria-label="Project name" name="name" placeholder="Project name" required style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="text" />
      <textarea aria-label="Project description" name="description" placeholder="Project description" required rows={3} style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} />
      <select aria-label="Project status" defaultValue="draft" name="status" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}>
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
      </select>
      <select aria-label="Designer assignee" defaultValue="" name="designerId" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}>
        <option value="">No designer assigned</option>
        {designerOptions.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <select aria-label="Purchaser assignee" defaultValue="" name="purchaserId" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}>
        <option value="">No purchaser assigned</option>
        {purchaserOptions.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        style={{
          justifySelf: 'start',
          padding: '0.85rem 1.1rem',
          border: 'none',
          borderRadius: '999px',
          background: 'var(--color-accent)',
          color: '#fffaf2',
          cursor: 'pointer',
        }}
      >
        Save project
      </button>
    </form>
  );
}
