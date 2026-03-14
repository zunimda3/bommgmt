import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell/app-shell';
import { getSession } from '@/lib/auth/session';

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <AppShell showUsersLink={session.role === 'owner'} title="Workspace">
      {children}
    </AppShell>
  );
}
