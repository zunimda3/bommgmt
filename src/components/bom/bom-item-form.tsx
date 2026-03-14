type BomItemFormProps = {
  canEdit: boolean;
};

export function BomItemForm({ canEdit }: BomItemFormProps) {
  if (!canEdit) {
    return (
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>
        Designers can add or edit BOM items here. Other roles have read-only access.
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
        background: 'var(--color-accent)',
        color: '#fffaf2',
        cursor: 'pointer',
      }}
    >
      Add BOM item
    </button>
  );
}
