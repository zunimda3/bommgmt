import { DEMO_ANNOUNCEMENTS } from '@/lib/demo-announcements';
import { listAnnouncements as listPersistedAnnouncements } from '@/lib/data/announcements';
import type { DemoRole } from '@/lib/demo-users';

type CreateAnnouncementInput = {
  actor: {
    id: string;
    role: DemoRole;
  };
  input: {
    body: string;
    title: string;
  };
};

export async function createAnnouncement({ actor, input }: CreateAnnouncementInput) {
  if (actor.role !== 'owner') {
    throw new Error('Not authorized to create announcements');
  }

  const nextAnnouncement = {
    id: `announcement-${DEMO_ANNOUNCEMENTS.length + 1}`,
    ...input,
  };

  DEMO_ANNOUNCEMENTS.unshift(nextAnnouncement);

  return nextAnnouncement;
}

export async function listAnnouncements() {
  return listPersistedAnnouncements();
}
