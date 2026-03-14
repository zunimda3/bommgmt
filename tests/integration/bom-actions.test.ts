import { db } from '@/lib/db';
import { createBomItem } from '@/server/actions/bom';
import { getProjectPurchasingRows } from '@/server/actions/projects';
import { resetDatabaseForTest } from '../helpers/db';

test('designer creates a persisted bom item and purchasing totals regenerate', async () => {
  await resetDatabaseForTest();
  const [designer, project, module] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { email: 'designer@demo.local' } }),
    db.project.findUniqueOrThrow({ where: { code: 'PRJ-1001' } }),
    db.projectModule.findFirstOrThrow({ where: { name: 'Conveyor Frame' } }),
  ]);

  const item = await createBomItem({
    actor: { role: 'designer', id: designer.id },
    projectId: project.id,
    moduleId: module.id,
    input: {
      partNumber: 'CF-100',
      partDescription: 'Frame rail',
      vendor: 'Acme Metals',
      partCategory: 'fabrication',
      quantity: 3,
      price: 140,
    },
  });

  const persistedItem = await db.bomItem.findUnique({
    where: {
      id: item.id,
    },
  });
  const purchasingRows = await getProjectPurchasingRows(project.id);
  const frameRailRow = purchasingRows.find((row) => row.partNumber === 'CF-100');

  expect(persistedItem?.partNumber).toBe('CF-100');
  expect(frameRailRow?.totalQuantity).toBe(5);
});

test('purchaser cannot create bom items', async () => {
  await resetDatabaseForTest();
  const [purchaser, project, module] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { email: 'purchaser@demo.local' } }),
    db.project.findUniqueOrThrow({ where: { code: 'PRJ-1001' } }),
    db.projectModule.findFirstOrThrow({ where: { name: 'Conveyor Frame' } }),
  ]);

  await expect(
    createBomItem({
      actor: { role: 'purchaser', id: purchaser.id },
      projectId: project.id,
      moduleId: module.id,
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
