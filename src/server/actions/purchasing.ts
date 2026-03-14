import { canEditPurchasing } from '@/lib/permissions';
import { getProjectPurchasingView as getPersistedProjectPurchasingView, upsertPurchasingWorkflow } from '@/lib/data/purchasing';
import { getProjectById } from '@/lib/data/projects';
import { getProjectPurchasingRows } from '@/server/actions/projects';
import type { DemoRole } from '@/lib/demo-users';
import { purchasingWorkflowInputSchema } from '@/lib/validators/purchasing';

type UpdatePurchasingWorkflowInput = {
  actor: {
    id: string;
    role: DemoRole;
  };
  input: {
    notes: string;
    poNumber: string;
    quotedPrice: number;
    status: 'pending' | 'quoted' | 'ordered' | 'received';
    supplierSelected: string;
  };
  projectId: string;
  purchasingItemId: string;
};

export async function updatePurchasingWorkflow({
  actor,
  input,
  projectId,
  purchasingItemId,
}: UpdatePurchasingWorkflowInput) {
  const [project, rows] = await Promise.all([getProjectById(projectId), getProjectPurchasingRows(projectId)]);

  if (!project) {
    throw new Error('Project not found');
  }

  const isAssigned = project.designerId === actor.id || project.purchaserId === actor.id;

  if (!canEditPurchasing({ role: actor.role, isAssigned })) {
    throw new Error('Not authorized to edit purchasing workflow');
  }

  const baseRow = rows.find((row) => row.aggregateKey === purchasingItemId);

  if (!baseRow) {
    throw new Error('Purchasing item not found');
  }

  const parsedInput = purchasingWorkflowInputSchema.parse(input);

  const persistedRow = await upsertPurchasingWorkflow({
    aggregateKey: purchasingItemId,
    projectId,
    partNumber: baseRow.partNumber,
    partDescription: baseRow.partDescription,
    vendor: baseRow.vendor,
    partCategory: baseRow.partCategory,
    totalQuantity: baseRow.totalQuantity,
    ...parsedInput,
  });

  return {
    aggregateKey: persistedRow.aggregateKey,
    notes: persistedRow.notes,
    poNumber: persistedRow.poNumber,
    quotedPrice: persistedRow.quotedPrice ? Number(persistedRow.quotedPrice) : null,
    status: persistedRow.status,
    supplierSelected: persistedRow.supplierSelected,
    totalQuantity: persistedRow.totalQuantity,
  };
}

export async function getPurchasingView(projectId: string) {
  return getPersistedProjectPurchasingView(projectId);
}
