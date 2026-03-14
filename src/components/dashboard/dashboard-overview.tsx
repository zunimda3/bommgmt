export function DashboardOverview() {
  return (
    <section
      style={{
        display: 'grid',
        gap: '1.25rem',
      }}
    >
      <div>
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Workspace
        </p>
        <h1 style={{ marginBottom: 0 }}>Dashboard</h1>
      </div>
      <article
        style={{
          padding: '1.5rem',
          borderRadius: '1.5rem',
          background: 'rgba(255, 250, 242, 0.94)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Announcement
        </p>
        <h2 style={{ marginBottom: '0.5rem' }}>Owner Bulletin</h2>
        <p style={{ margin: 0, color: 'var(--color-muted)', lineHeight: 1.6 }}>
          Stay aligned on active project changes, procurement risks, and priority updates from the owner team.
        </p>
      </article>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <article
          style={{
            padding: '1.5rem',
            borderRadius: '1.5rem',
            background: 'rgba(255, 250, 242, 0.94)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Projects</h3>
          <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>Jump into assigned or managed project work.</p>
        </article>
        <article
          style={{
            padding: '1.5rem',
            borderRadius: '1.5rem',
            background: 'rgba(255, 250, 242, 0.94)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Purchasing sync</h3>
          <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>
            Purchasing totals will follow BOM changes once project workflows are active.
          </p>
        </article>
      </div>
    </section>
  );
}
