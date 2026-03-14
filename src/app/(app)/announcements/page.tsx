import { AnnouncementForm } from '@/components/announcements/announcement-form';
import { AnnouncementList } from '@/components/announcements/announcement-list';
import { getCurrentUser } from '@/lib/auth/current-user';
import { listAnnouncements } from '@/server/actions/announcements';

export default async function AnnouncementsPage() {
  const [announcements, currentUser] = await Promise.all([listAnnouncements(), getCurrentUser()]);

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <AnnouncementForm canCreate={currentUser?.role === 'owner'} />
      <AnnouncementList announcements={announcements} />
    </section>
  );
}
