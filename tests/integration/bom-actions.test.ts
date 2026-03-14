import { createBomItem } from '@/server/actions/bom';

test('purchaser cannot create bom items', async () => {
  await expect(
    createBomItem({
      actor: { role: 'purchaser', id: 'purchaser-demo-user' },
      projectId: 'project-1',
      moduleId: 'module-1',
      input: {
        partNumber: 'PN-1',
        partDescription: 'Bracket',
        vendor: 'Acme',
        partCategory: 'fabrication',
        quantity: 1,
        price: 10,
      },
    }),
  ).rejects.toThrow(/not authorized/i);
});
