import type { DemoUser } from '@/lib/demo-users';

type UserTableProps = {
  users: DemoUser[];
};

export function UserTable({ users }: UserTableProps) {
  return (
    <section
      style={{
        padding: '1.25rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 250, 242, 0.94)',
        border: '1px solid var(--color-border)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Name', 'Email', 'Role'].map((label) => (
              <th
                key={label}
                style={{
                  padding: '0.85rem 0.5rem',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {user.name}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {user.email}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {user.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
