import { FeatureGrid } from '@/components/marketing/feature-grid';
import { Hero } from '@/components/marketing/hero';
import { RoleStrip } from '@/components/marketing/role-strip';

export default function HomePage() {
  return (
    <main
      style={{
        display: 'grid',
        gap: '1.5rem',
        maxWidth: '72rem',
        margin: '0 auto',
        padding: '2rem 1.25rem 4rem',
      }}
    >
      <Hero />
      <FeatureGrid />
      <RoleStrip />
    </main>
  );
}
