import { canEditPurchasing } from '@/lib/permissions';
import { mergeWorkflowFields } from '@/lib/purchasing/sync';
import { getProjectPurchasingRows } from '@/server/actions/projects';
import type { DemoRole } from '@/lib/demo-users';

const purchasingWorkflowStore = new Map<
  string,
  {
    notes?: string | null;
    poNumber?: string | null;
    quotedPrice?: number | null;
    status?: string | null;
    supplierSelected?: string | null;
  }
>();

type UpdatePurchasingWorkflowInput = {
  actor: {
    id: string;
    role: DemoRole;
  };
  input: {
    notes: string;
    poNumber: string;
    quotedPrice: number;
    status: string;
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
  const rows = await getProjectPurchasingRows(projectId);
  const isAssigned = rows.length > 0 && (actor.id === 'purchaser-demo-user' || actor.id === 'designer-demo-user');

  if (!canEditPurchasing({ role: actor.role, isAssigned })) {
    throw new Error('Not authorized to edit purchasing workflow');
  }

  purchasingWorkflowStore.set(purchasingItemId, input);

  return {
    aggregateKey: purchasingItemId,
    ...input,
  };
}

export async function getPurchasingView(projectId: string) {
  const rows = await getProjectPurchasingRows(projectId);
  const existing = rows
    .map((row) => {
      const workflow = purchasingWorkflowStore.get(row.aggregateKey);
      if (!workflow) {
        return null;
      }

      return {
        aggregateKey: row.aggregateKey,
        ...workflow,
      };
    })
    .filter(
      (
        value,
      ): value is {
        aggregateKey: string;
        notes?: string | null;
        poNumber?: string | null;
        quotedPrice?: number | null;
        status?: string | null;
        supplierSelected?: string | null;
      } => value !== null,
    );

  return mergeWorkflowFields({
    existing,
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
