export type AggregatePartCategory = 'fabrication' | 'standard_part' | 'modifications';

export type AggregateBomItem = {
  projectId: string;
  partNumber: string;
  partDescription: string;
  vendor: string;
  partCategory: AggregatePartCategory;
  quantity: number;
};

export type AggregatePurchasingRow = {
  aggregateKey: string;
  partCategory: AggregatePartCategory;
  partDescription: string;
  partNumber: string;
  projectId: string;
  totalQuantity: number;
  vendor: string;
};

type AggregateKeyInput = Pick<
  AggregatePurchasingRow,
  'projectId' | 'partNumber' | 'partDescription' | 'vendor' | 'partCategory'
>;

function buildAggregateKey(item: AggregateKeyInput) {
  return [
    item.projectId,
    item.partNumber,
    item.partDescription,
    item.vendor,
    item.partCategory,
  ].join('|');
}

export function aggregateBomItems(items: AggregateBomItem[]): AggregatePurchasingRow[] {
  const grouped = new Map<string, AggregatePurchasingRow>();

  for (const item of items) {
    const baseRow = {
      projectId: item.projectId,
      partNumber: item.partNumber,
      partDescription: item.partDescription,
      vendor: item.vendor,
      partCategory: item.partCategory,
    };
    const aggregateKey = buildAggregateKey(baseRow);
    const existingRow = grouped.get(aggregateKey);

    if (existingRow) {
      existingRow.totalQuantity += item.quantity;
      continue;
    }

    grouped.set(aggregateKey, {
      ...baseRow,
      aggregateKey,
      totalQuantity: item.quantity,
    });
  }

  return [...grouped.values()].sort((left, right) => left.aggregateKey.localeCompare(right.aggregateKey));
}
