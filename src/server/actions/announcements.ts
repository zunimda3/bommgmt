'use server';

import { revalidatePath } from 'next/cache';
import {
  createPersistedAnnouncement,
  listAnnouncements as listPersistedAnnouncements,
} from '@/lib/data/announcements';
import { requireCurrentUser } from '@/lib/auth/current-user';
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

export async function createAnnouncementFromForm(formData: FormData) {
  const actor = await requireCurrentUser();

  await createAnnouncement({
    actor: {
      id: actor.userId,
      role: actor.role,
    },
    input: {
      title: String(formData.get('title') ?? ''),
      body: String(formData.get('body') ?? ''),
    },
  });

  revalidatePath('/announcements');
  revalidatePath('/dashboard');
}
