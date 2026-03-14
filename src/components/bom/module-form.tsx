import { createProjectModuleFromForm } from '@/server/actions/projects';

type ModuleFormProps = {
  canManage: boolean;
  projectId: string;
};

export function ModuleForm({ canManage, projectId }: ModuleFormProps) {
  if (!canManage) {
    return null;
  }

  const action = createProjectModuleFromForm.bind(null, projectId);

  return (
    <form
      action={action}
      style={{
        display: 'grid',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: '1.25rem',
        background: 'rgba(255, 250, 242, 0.94)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h2 style={{ margin: 0 }}>Create module</h2>
      <input
        aria-label="Module name"
        name="name"
        placeholder="Module name"
        required
        style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
        type="text"
      />
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
        Save module
      </button>
    </form>
  );
}
