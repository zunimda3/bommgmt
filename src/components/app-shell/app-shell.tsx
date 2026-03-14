import type { ReactNode } from 'react';
import { AppNav } from './nav';

type AppShellProps = {
  children: ReactNode;
  title: string;
  showUsersLink?: boolean;
};

export function AppShell({ children, title, showUsersLink = false }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <p className="app-shell__brand">BOM Central</p>
        <AppNav showUsersLink={showUsersLink} />
      </aside>
      <main className="app-shell__content">
        <section className="app-shell__panel">
          <h1 className="app-shell__title">{title}</h1>
          <div>{children}</div>
        </section>
      </main>
    </div>
  );
}
