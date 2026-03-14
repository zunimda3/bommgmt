import { createBomItemFromForm } from '@/server/actions/bom';

type BomItemFormProps = {
  canEdit: boolean;
  modules: Array<{
    id: string;
    name: string;
  }>;
  projectId: string;
};

export function BomItemForm({ canEdit, modules, projectId }: BomItemFormProps) {
  if (!canEdit) {
    return (
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>
        Designers can add or edit BOM items here. Other roles have read-only access.
      </p>
    );
  }

  const action = createBomItemFromForm.bind(null, projectId);

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
      <h2 style={{ margin: 0 }}>Add BOM item</h2>
      <select aria-label="BOM module" defaultValue={modules[0]?.id ?? ''} name="moduleId" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.name}
          </option>
        ))}
      </select>
      <input aria-label="Part number" name="partNumber" placeholder="Part number" required style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="text" />
      <input aria-label="Part description" name="partDescription" placeholder="Part description" required style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="text" />
      <input aria-label="Vendor" name="vendor" placeholder="Vendor" required style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="text" />
      <select aria-label="Part category" defaultValue="fabrication" name="partCategory" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}>
        <option value="fabrication">Fabrication</option>
        <option value="standard_part">Standard part</option>
        <option value="modifications">Modifications</option>
      </select>
      <input aria-label="Quantity" min="1" name="quantity" placeholder="Quantity" required style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="number" />
      <input aria-label="Price" min="0" name="price" placeholder="Price" required step="0.01" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="number" />
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
        Save BOM item
      </button>
    </form>
  );
}
