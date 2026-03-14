import { db } from '@/lib/db';

export async function findActiveUserByEmail(email: string) {
  return db.user.findFirst({
    where: {
      email,
      isActive: true,
    },
  });
}

export async function findActiveUserById(id: string) {
  return db.user.findFirst({
    where: {
      id,
      isActive: true,
    },
  });
}
