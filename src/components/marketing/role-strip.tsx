const ROLES = [
  { role: 'Owner', scope: 'Full access, announcements, user management' },
  { role: 'Admin', scope: 'Project ownership, assignment, and operational oversight' },
  { role: 'Designer', scope: 'BOM write access on assigned projects' },
  { role: 'Purchaser', scope: 'Purchasing workflow write access on assigned projects' },
];

export function RoleStrip() {
  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginBottom: 0 }}>Role-based workflow</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {ROLES.map((entry) => (
          <div
            key={entry.role}
            style={{
              padding: '1rem 1.1rem',
              borderRadius: '1.25rem',
              background: 'rgba(255, 250, 242, 0.92)',
              border: '1px solid var(--color-border)',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '0.35rem' }}>{entry.role}</strong>
            <span style={{ color: 'var(--color-muted)', lineHeight: 1.5 }}>{entry.scope}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
