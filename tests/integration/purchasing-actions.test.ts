import { db } from '@/lib/db';
import { getProjectPurchasingRows } from '@/server/actions/projects';
import { updatePurchasingWorkflow } from '@/server/actions/purchasing';
import { resetDatabaseForTest } from '../helpers/db';

test('purchasing rows are derived from persisted bom items', async () => {
  await resetDatabaseForTest();
  const project = await db.project.findUniqueOrThrow({
    where: {
      code: 'PRJ-1001',
    },
  });

  const rows = await getProjectPurchasingRows(project.id);

  expect(rows[0]?.partNumber).toBe('CF-100');
});

test('purchaser updates workflow fields on a persisted purchasing row', async () => {
  await resetDatabaseForTest();
  const [purchaser, project] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { email: 'purchaser@demo.local' } }),
    db.project.findUniqueOrThrow({ where: { code: 'PRJ-1001' } }),
  ]);

  const row = await updatePurchasingWorkflow({
    actor: { id: purchaser.id, role: 'purchaser' },
    projectId: project.id,
    purchasingItemId: `${project.id}|CF-100|Frame rail|Acme Metals|fabrication`,
    input: {
      status: 'quoted',
      supplierSelected: 'Acme Metals',
      quotedPrice: 133.5,
      poNumber: 'PO-1001',
      notes: 'Ready for approval',
    },
  });

  expect(row.status).toBe('quoted');
  expect(row.poNumber).toBe('PO-1001');
});

test('designer cannot update purchasing workflow', async () => {
  await resetDatabaseForTest();
  const designer = await db.user.findUniqueOrThrow({
    where: {
      email: 'designer@demo.local',
    },
  });
  const project = await db.project.findUniqueOrThrow({
    where: {
      code: 'PRJ-1001',
    },
  });

  await expect(
    updatePurchasingWorkflow({
      actor: { role: 'designer', id: designer.id },
      projectId: project.id,
      purchasingItemId: `${project.id}|CF-100|Frame rail|Acme Metals|fabrication`,
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
