import Link from 'next/link';

type ProjectOverviewProps = {
  project: {
    description: string;
    id: string;
    name: string;
  };
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <article
        style={{
          padding: '1.5rem',
          borderRadius: '1.5rem',
          background: 'rgba(255, 250, 242, 0.94)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Project overview
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>{project.name}</h1>
        <p style={{ margin: 0, color: 'var(--color-muted)', lineHeight: 1.7 }}>{project.description}</p>
      </article>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <Link
          href={`/projects/${project.id}/bom`}
          style={{
            padding: '1.25rem',
            borderRadius: '1.5rem',
            background: 'rgba(255, 250, 242, 0.94)',
            border: '1px solid var(--color-border)',
          }}
        >
          BOM
        </Link>
        <Link
          href={`/projects/${project.id}/purchasing`}
          style={{
            padding: '1.25rem',
            borderRadius: '1.5rem',
            background: 'rgba(255, 250, 242, 0.94)',
            border: '1px solid var(--color-border)',
          }}
        >
          Purchasing
        </Link>
      </div>
    </section>
  );
}
