const DEMO_ANNOUNCEMENTS = [
  {
    id: 'announcement-1',
    title: 'Quarter Kickoff',
    body: 'Prioritize BOM accuracy this week so purchasing can begin supplier outreach without delay.',
  },
] as const;

export function AnnouncementList() {
  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <h1 style={{ marginBottom: 0 }}>Announcements</h1>
      {DEMO_ANNOUNCEMENTS.map((announcement) => (
        <article
          key={announcement.id}
          style={{
            padding: '1.5rem',
            borderRadius: '1.5rem',
            background: 'rgba(255, 250, 242, 0.94)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>{announcement.title}</h2>
          <p style={{ marginBottom: 0, color: 'var(--color-muted)', lineHeight: 1.7 }}>{announcement.body}</p>
        </article>
      ))}
    </section>
  );
}
