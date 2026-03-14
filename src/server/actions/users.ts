'use server';

import { revalidatePath } from 'next/cache';
import { canManageUsers } from '@/lib/permissions';
import { createPersistedUser, listUsers as listPersistedUsers } from '@/lib/data/users';
import { requireCurrentUser } from '@/lib/auth/current-user';
import type { DemoRole } from '@/lib/demo-users';
import { userInputSchema } from '@/lib/validators/users';

type CreateUserInput = {
  actor: {
    id: string;
    role: DemoRole;
  };
  input: {
    email: string;
    name: string;
    role: DemoRole;
  };
};

export async function createUser({ actor, input }: CreateUserInput) {
  if (!canManageUsers(actor.role)) {
    throw new Error('Owner only action');
  }

  const parsedInput = userInputSchema.parse(input);

  return createPersistedUser(parsedInput);
}

export async function listUsers() {
  return listPersistedUsers();
}

export async function createUserFromForm(formData: FormData) {
  const actor = await requireCurrentUser();

  await createUser({
    actor: {
      id: actor.userId,
      role: actor.role,
    },
    input: {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      role: String(formData.get('role') ?? '') as DemoRole,
    },
  });

  revalidatePath('/users');
}
