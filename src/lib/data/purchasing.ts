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

export async function syncProjectPurchasingItems(projectId: string) {
  const rows = await getProjectPurchasingRows(projectId);
  const existingRows = await db.purchasingItem.findMany({
    where: {
      projectId,
    },
  });

  const mergedRows = mergeWorkflowFields({
    existing: existingRows.map((row) => ({
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
  });

  const mergedByKey = new Map(mergedRows.map((row) => [row.aggregateKey, row]));
  const aggregateKeys = rows.map((row) => row.aggregateKey);

  await db.$transaction([
    db.purchasingItem.deleteMany({
      where: {
        projectId,
        aggregateKey: {
          notIn: aggregateKeys.length ? aggregateKeys : ['__never__'],
        },
      },
    }),
    ...rows.map((row) => {
      const merged = mergedByKey.get(row.aggregateKey);

      return db.purchasingItem.upsert({
        where: {
          aggregateKey: row.aggregateKey,
        },
        update: {
          totalQuantity: row.totalQuantity,
          status: merged?.status ?? 'pending',
          supplierSelected: merged?.supplierSelected ?? null,
          quotedPrice: merged?.quotedPrice ?? null,
          poNumber: merged?.poNumber ?? null,
          notes: merged?.notes ?? null,
        },
        create: {
          projectId,
          aggregateKey: row.aggregateKey,
          partNumber: row.partNumber,
          partDescription: row.partDescription,
          vendor: row.vendor,
          partCategory: row.partCategory,
          totalQuantity: row.totalQuantity,
          status: merged?.status ?? 'pending',
          supplierSelected: merged?.supplierSelected ?? null,
          quotedPrice: merged?.quotedPrice ?? null,
          poNumber: merged?.poNumber ?? null,
          notes: merged?.notes ?? null,
        },
      });
    }),
  ]);
}

export async function upsertPurchasingWorkflow(input: {
  aggregateKey: string;
  notes: string;
  partCategory: 'fabrication' | 'standard_part' | 'modifications';
  partDescription: string;
  partNumber: string;
  poNumber: string;
  projectId: string;
  quotedPrice: number;
  status: 'pending' | 'quoted' | 'ordered' | 'received';
  supplierSelected: string;
  totalQuantity: number;
  vendor: string;
}) {
  return db.purchasingItem.upsert({
    where: {
      aggregateKey: input.aggregateKey,
    },
    update: {
      totalQuantity: input.totalQuantity,
      status: input.status,
      supplierSelected: input.supplierSelected,
      quotedPrice: input.quotedPrice,
      poNumber: input.poNumber,
      notes: input.notes,
    },
    create: input,
  });
}
