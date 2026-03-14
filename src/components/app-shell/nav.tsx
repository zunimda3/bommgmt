const DEFAULT_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/projects', label: 'Projects' },
] as const;

type AppNavProps = {
  showUsersLink?: boolean;
};

export function AppNav({ showUsersLink = false }: AppNavProps) {
  const items = showUsersLink
    ? [...DEFAULT_ITEMS, { href: '/users', label: 'Users' as const }]
    : DEFAULT_ITEMS;

  return (
    <nav aria-label="Primary" className="app-shell__nav">
      {items.map((item) => (
        <a key={item.href} className="app-shell__nav-link" href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
