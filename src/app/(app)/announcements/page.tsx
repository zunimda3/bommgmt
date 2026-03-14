import { AnnouncementForm } from '@/components/announcements/announcement-form';
import { AnnouncementList } from '@/components/announcements/announcement-list';
import { listAnnouncements } from '@/server/actions/announcements';

export default function AnnouncementsPage() {
  const announcements = listAnnouncements();

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <AnnouncementForm />
      <AnnouncementList announcements={announcements} />
    </section>
  );
}
