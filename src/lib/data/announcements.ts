import { db } from '@/lib/db';

export async function listAnnouncements() {
  return db.announcement.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getLatestAnnouncement() {
  return db.announcement.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });
}
