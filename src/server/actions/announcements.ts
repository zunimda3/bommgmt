import {
  createPersistedAnnouncement,
  listAnnouncements as listPersistedAnnouncements,
} from '@/lib/data/announcements';
import type { DemoRole } from '@/lib/demo-users';
import { announcementInputSchema } from '@/lib/validators/announcements';

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

  const parsedInput = announcementInputSchema.parse(input);

  return createPersistedAnnouncement({
    ...parsedInput,
    createdById: actor.id,
  });
}

export async function listAnnouncements() {
  return listPersistedAnnouncements();
}
