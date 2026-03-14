import { mergeWorkflowFields } from '@/lib/purchasing/sync';

test('preserves purchaser workflow values when aggregated key still exists', () => {
  const merged = mergeWorkflowFields({
    existing: [
      {
        aggregateKey: 'p1|PN-100|Linear rail|Acme|standard_part',
        status: 'quoted',
        supplierSelected: 'Acme',
        quotedPrice: 125,
        poNumber: 'PO-9',
        notes: 'approved',
      },
    ],
    next: [
      {
        aggregateKey: 'p1|PN-100|Linear rail|Acme|standard_part',
        totalQuantity: 6,
      },
    ],
  });

  expect(merged[0].status).toBe('quoted');
  expect(merged[0].poNumber).toBe('PO-9');
  expect(merged[0].totalQuantity).toBe(6);
});
