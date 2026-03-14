import { createUser } from '@/server/actions/users';

test('admin cannot create users', async () => {
  await expect(
    createUser({
      actor: { role: 'admin', id: 'admin-demo-user' },
      input: {
        name: 'New Purchaser',
        email: 'new.purchaser@demo.local',
        role: 'purchaser',
      },
    }),
  ).rejects.toThrow(/owner only/i);
});
