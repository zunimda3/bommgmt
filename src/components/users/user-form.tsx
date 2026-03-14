import { createUserFromForm } from '@/server/actions/users';

export function UserForm() {
  return (
    <form
      action={createUserFromForm}
      style={{
        display: 'grid',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: '1.25rem',
        background: 'rgba(255, 250, 242, 0.94)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h2 style={{ margin: 0 }}>Create user</h2>
      <input
        aria-label="User name"
        name="name"
        placeholder="Full name"
        required
        style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
        type="text"
      />
      <input
        aria-label="User email"
        name="email"
        placeholder="user@company.local"
        required
        style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
        type="email"
      />
      <select
        aria-label="User role"
        defaultValue="designer"
        name="role"
        style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
      >
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
        <option value="designer">Designer</option>
        <option value="purchaser">Purchaser</option>
      </select>
      <button
        type="submit"
        style={{
          justifySelf: 'start',
          padding: '0.85rem 1.1rem',
          border: 'none',
          borderRadius: '999px',
          background: 'var(--color-accent)',
          color: '#fffaf2',
          cursor: 'pointer',
        }}
      >
        Save user
      </button>
    </form>
  );
}
