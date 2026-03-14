import { canManageUsers } from '@/lib/permissions';
import { createPersistedUser, listUsers as listPersistedUsers } from '@/lib/data/users';
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
