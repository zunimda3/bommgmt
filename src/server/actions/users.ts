import { canManageUsers } from '@/lib/permissions';
import { listUsers as listPersistedUsers } from '@/lib/data/users';
import { DEMO_USERS, type DemoRole } from '@/lib/demo-users';

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

  const nextUser = {
    id: `${input.role}-${DEMO_USERS.length + 1}`,
    ...input,
  };

  DEMO_USERS.push(nextUser);

  return nextUser;
}

export async function listUsers() {
  return listPersistedUsers();
}
