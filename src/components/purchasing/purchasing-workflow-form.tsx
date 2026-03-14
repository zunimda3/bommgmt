type PurchasingWorkflowFormProps = {
  canEdit: boolean;
};

export function PurchasingWorkflowForm({ canEdit }: PurchasingWorkflowFormProps) {
  if (!canEdit) {
    return (
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>
        Purchasers can update workflow fields here. Designers have read-only access.
      </p>
    );
  }

  return (
    <button
      type="button"
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
      Update purchasing workflow
    </button>
  );
}
