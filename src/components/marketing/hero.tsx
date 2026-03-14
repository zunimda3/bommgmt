import Link from 'next/link';

export function Hero() {
  return (
    <section
      style={{
        display: 'grid',
        gap: '2rem',
        padding: '3rem',
        borderRadius: '2rem',
        background:
          'linear-gradient(135deg, rgba(157, 77, 27, 0.96), rgba(100, 40, 12, 0.92) 52%, rgba(31, 27, 22, 0.92) 100%)',
        color: '#fffaf2',
        boxShadow: '0 30px 80px rgba(59, 28, 13, 0.28)',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '0.9rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255, 238, 219, 0.74)',
        }}
      >
        Centralized project procurement planning
      </p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.06em',
          }}
        >
          Centralized BOM Management for every project team.
        </h1>
        <p style={{ margin: 0, maxWidth: '42rem', fontSize: '1.1rem', lineHeight: 1.6, color: '#f5e6d4' }}>
          BOM Central keeps designers, purchasers, admins, and owners aligned on the same project truth. Designers
          maintain the material list. Purchasers work from an aggregated buying view. Everyone sees the same project
          story.
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          href="/login"
          style={{
            padding: '1rem 1.5rem',
            borderRadius: '999px',
            background: '#fffaf2',
            color: '#5a290f',
            fontWeight: 700,
          }}
        >
          Log in
        </Link>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderRadius: '999px',
            border: '1px solid rgba(255, 238, 219, 0.24)',
            color: 'rgba(255, 238, 219, 0.82)',
          }}
        >
          Single company v1, multi-company ready later
        </span>
      </div>
    </section>
  );
}
