import Link from 'next/link';
import type { DemoProject } from '@/lib/demo-projects';

type ProjectsTableProps = {
  projects: DemoProject[];
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <h1 style={{ marginBottom: 0 }}>Projects</h1>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {projects.map((project) => (
          <article
            key={project.id}
            style={{
              display: 'grid',
              gap: '0.35rem',
              padding: '1.25rem',
              borderRadius: '1.25rem',
              background: 'rgba(255, 250, 242, 0.94)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {project.code}
                </p>
                <h2 style={{ margin: '0.35rem 0' }}>{project.name}</h2>
              </div>
              <Link href={`/projects/${project.id}`}>Open project</Link>
            </div>
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
