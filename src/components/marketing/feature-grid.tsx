const FEATURES = [
  {
    title: 'Project-scoped visibility',
    description: 'Every project holds the team list, overview, BOM modules, and the purchasing master list in one place.',
  },
  {
    title: 'Role-bound editing',
    description: 'Designers edit BOM items, purchasers manage procurement workflow, and owners/admins keep delivery moving.',
  },
  {
    title: 'Purchasing derived from BOM',
    description: 'The purchasing list aggregates BOM items automatically, reducing manual duplication and broken handoffs.',
  },
];

export function FeatureGrid() {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}
    >
      {FEATURES.map((feature) => (
        <article
          key={feature.title}
          style={{
            padding: '1.5rem',
            borderRadius: '1.5rem',
            background: 'rgba(255, 250, 242, 0.82)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>{feature.title}</h2>
          <p style={{ marginBottom: 0, color: 'var(--color-muted)', lineHeight: 1.7 }}>{feature.description}</p>
        </article>
      ))}
    </section>
  );
}
