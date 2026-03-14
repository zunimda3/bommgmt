import { DEMO_USERS } from '@/lib/demo-users';
import { loginDemoUser } from '@/server/actions/auth';

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
      }}
    >
      <form
        action={loginDemoUser}
        style={{
          width: 'min(420px, 100%)',
          padding: '2rem',
          borderRadius: '1.5rem',
          background: 'rgba(255, 250, 242, 0.92)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-panel)',
        }}
      >
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>
          Demo Access
        </p>
        <h1 style={{ marginBottom: '1rem' }}>Log in to BOM Central</h1>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Demo user
        </label>
        <select
          defaultValue={DEMO_USERS[0]?.email}
          id="email"
          name="email"
          style={{
            width: '100%',
            marginBottom: '1rem',
            padding: '0.9rem 1rem',
            borderRadius: '0.9rem',
            border: '1px solid var(--color-border)',
          }}
        >
          {DEMO_USERS.map((user) => (
            <option key={user.email} value={user.email}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
        <button
          style={{
            width: '100%',
            padding: '0.95rem 1rem',
            border: 'none',
            borderRadius: '999px',
            background: 'var(--color-accent)',
            color: '#fffaf2',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          type="submit"
        >
          Enter App
        </button>
      </form>
    </main>
  );
}
