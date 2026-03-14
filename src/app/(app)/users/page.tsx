import { redirect } from 'next/navigation';
import { UserForm } from '@/components/users/user-form';
import { UserTable } from '@/components/users/user-table';
import { getCurrentUser } from '@/lib/auth/current-user';
import { listUsers } from '@/server/actions/users';

export default async function UsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'owner') {
    redirect('/dashboard');
  }

  const users = await listUsers();

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <p style={{ margin: 0, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Owner controls
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>Users</h1>
      </div>
      <UserForm />
      <UserTable users={users} />
    </section>
  );
}
