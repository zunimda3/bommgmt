import { updatePurchasingWorkflow } from '@/server/actions/purchasing';

test('designer cannot update purchasing workflow', async () => {
  await expect(
    updatePurchasingWorkflow({
      actor: { role: 'designer', id: 'designer-demo-user' },
      projectId: 'project-1',
      purchasingItemId: 'project-1|CF-100|Frame rail|Acme Metals|fabrication',
      input: {
        status: 'quoted',
        supplierSelected: 'Acme',
        quotedPrice: 125,
        poNumber: 'PO-1',
        notes: 'ready',
      },
    }),
  ).rejects.toThrow(/not authorized/i);
});
