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

export async function listUsers() {
  return db.user.findMany({
    orderBy: [{ role: 'asc' }, { name: 'asc' }],
  });
}

export async function createPersistedUser(input: {
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'designer' | 'purchaser';
}) {
  return db.user.create({
    data: input,
  });
}
