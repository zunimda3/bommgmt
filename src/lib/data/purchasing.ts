import { db } from '@/lib/db';
import { listAggregateBomItems } from '@/lib/data/bom';
import { aggregateBomItems } from '@/lib/purchasing/aggregate';
import { mergeWorkflowFields } from '@/lib/purchasing/sync';

export async function getProjectPurchasingRows(projectId: string) {
  const bomItems = await listAggregateBomItems(projectId);
  return aggregateBomItems(bomItems);
}

export async function getProjectPurchasingView(projectId: string) {
  const [rows, persistedWorkflow] = await Promise.all([
    getProjectPurchasingRows(projectId),
    db.purchasingItem.findMany({
      where: {
        projectId,
      },
      orderBy: {
        aggregateKey: 'asc',
      },
    }),
  ]);

  return mergeWorkflowFields({
    existing: persistedWorkflow.map((row) => ({
      aggregateKey: row.aggregateKey,
      notes: row.notes,
      poNumber: row.poNumber,
      quotedPrice: row.quotedPrice ? Number(row.quotedPrice) : null,
      status: row.status,
      supplierSelected: row.supplierSelected,
    })),
    next: rows.map((row) => ({
      aggregateKey: row.aggregateKey,
      totalQuantity: row.totalQuantity,
    })),
  }).map((row) => {
    const baseRow = rows.find((entry) => entry.aggregateKey === row.aggregateKey);

    if (!baseRow) {
      throw new Error('Missing purchasing row');
    }

    return {
      ...baseRow,
      ...row,
    };
  });
}
