import { createAnnouncement } from '@/server/actions/announcements';

test('designer cannot create announcements', async () => {
  await expect(
    createAnnouncement({
      actor: { role: 'designer', id: 'designer-demo-user' },
      input: { title: 'Notice', body: 'Body' },
    }),
  ).rejects.toThrow(/not authorized/i);
});
