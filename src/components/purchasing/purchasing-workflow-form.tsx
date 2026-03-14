import { updatePurchasingWorkflowFromForm } from '@/server/actions/purchasing';

type PurchasingWorkflowFormProps = {
  canEdit: boolean;
  projectId: string;
  rows: Array<{
    aggregateKey: string;
    partNumber: string;
  }>;
};

export function PurchasingWorkflowForm({ canEdit, projectId, rows }: PurchasingWorkflowFormProps) {
  if (!canEdit) {
    return (
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>
        Purchasers can update workflow fields here. Designers have read-only access.
      </p>
    );
  }

  const action = updatePurchasingWorkflowFromForm.bind(null, projectId);

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
      <h2 style={{ margin: 0 }}>Update purchasing workflow</h2>
      <select aria-label="Purchasing item" defaultValue={rows[0]?.aggregateKey ?? ''} name="aggregateKey" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}>
        {rows.map((row) => (
          <option key={row.aggregateKey} value={row.aggregateKey}>
            {row.partNumber}
          </option>
        ))}
      </select>
      <select aria-label="Purchasing status" defaultValue="pending" name="status" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}>
        <option value="pending">Pending</option>
        <option value="quoted">Quoted</option>
        <option value="ordered">Ordered</option>
        <option value="received">Received</option>
      </select>
      <input aria-label="Supplier selected" name="supplierSelected" placeholder="Supplier selected" required style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="text" />
      <input aria-label="Quoted price" min="0" name="quotedPrice" placeholder="Quoted price" required step="0.01" style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="number" />
      <input aria-label="PO number" name="poNumber" placeholder="PO number" required style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} type="text" />
      <textarea aria-label="Purchasing notes" name="notes" placeholder="Notes" required rows={3} style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }} />
      <button
        type="submit"
        style={{
          justifySelf: 'start',
          padding: '0.85rem 1.1rem',
          border: 'none',
          borderRadius: '999px',
          background: '#1f1b16',
          color: '#fffaf2',
          cursor: 'pointer',
        }}
      >
        Save purchasing workflow
      </button>
    </form>
  );
}
