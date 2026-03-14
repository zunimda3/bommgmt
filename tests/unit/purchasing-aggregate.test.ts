import { aggregateBomItems } from '@/lib/purchasing/aggregate';

test('groups bom items into project purchasing rows by shared key', () => {
  const rows = aggregateBomItems([
    {
      projectId: 'p1',
      partNumber: 'PN-100',
      partDescription: 'Linear rail',
      vendor: 'Acme',
      partCategory: 'standard_part',
      quantity: 2,
    },
    {
      projectId: 'p1',
      partNumber: 'PN-100',
      partDescription: 'Linear rail',
      vendor: 'Acme',
      partCategory: 'standard_part',
      quantity: 3,
    },
  ]);

  expect(rows).toHaveLength(1);
  expect(rows[0].totalQuantity).toBe(5);
});
