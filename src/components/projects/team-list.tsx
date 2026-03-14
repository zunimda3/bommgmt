type TeamListProps = {
  designerName: string;
  purchaserName: string;
};

export function TeamList({ designerName, purchaserName }: TeamListProps) {
  return (
    <section
      style={{
        padding: '1.5rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 250, 242, 0.94)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Team list</h2>
      <p style={{ marginBottom: '0.5rem', color: 'var(--color-muted)' }}>Designer: {designerName}</p>
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>Purchaser: {purchaserName}</p>
    </section>
  );
}
