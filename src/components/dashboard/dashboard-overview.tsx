type DashboardOverviewProps = {
  activeProjectCount: number;
  announcement: {
    body: string;
    title: string;
  } | null;
  projectCount: number;
};

export function DashboardOverview({ activeProjectCount, announcement, projectCount }: DashboardOverviewProps) {
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
        <h2 style={{ marginBottom: '0.5rem' }}>{announcement?.title ?? 'No announcements yet'}</h2>
        <p style={{ margin: 0, color: 'var(--color-muted)', lineHeight: 1.6 }}>
          {announcement?.body ?? 'Owner updates will appear here once announcements are published.'}
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
          <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>
            {projectCount} total projects in the shared workspace.
          </p>
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
            {activeProjectCount} active projects are ready for BOM and purchasing coordination.
          </p>
        </article>
      </div>
    </section>
  );
}
