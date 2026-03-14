type ExistingWorkflowRow = {
  aggregateKey: string;
  notes?: string | null;
  poNumber?: string | null;
  quotedPrice?: number | null;
  status?: string | null;
  supplierSelected?: string | null;
};

type NextAggregateRow = {
  aggregateKey: string;
  totalQuantity: number;
};

type MergeInput = {
  existing: ExistingWorkflowRow[];
  next: NextAggregateRow[];
};

export function mergeWorkflowFields({ existing, next }: MergeInput) {
  const workflowByKey = new Map(existing.map((row) => [row.aggregateKey, row]));

  return next.map((row) => {
    const prior = workflowByKey.get(row.aggregateKey);

    return {
      ...row,
      status: prior?.status ?? 'pending',
      supplierSelected: prior?.supplierSelected ?? null,
      quotedPrice: prior?.quotedPrice ?? null,
      poNumber: prior?.poNumber ?? null,
      notes: prior?.notes ?? null,
    };
  });
}
