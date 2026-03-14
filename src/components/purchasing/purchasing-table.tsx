type PurchasingTableRow = {
  aggregateKey: string;
  notes: string | null;
  partCategory: 'fabrication' | 'standard_part' | 'modifications';
  partDescription: string;
  partNumber: string;
  poNumber: string | null;
  projectId: string;
  quotedPrice: number | null;
  status: 'pending' | 'quoted' | 'ordered' | 'received';
  supplierSelected: string | null;
  totalQuantity: number;
  vendor: string;
};

type PurchasingTableProps = {
  rows: PurchasingTableRow[];
};

export function PurchasingTable({ rows }: PurchasingTableProps) {
  if (!rows.length) {
    return (
      <section
        style={{
          padding: '1.5rem',
          borderRadius: '1.5rem',
          background: 'rgba(255, 250, 242, 0.94)',
          border: '1px solid var(--color-border)',
        }}
      >
        No purchasing items yet.
      </section>
    );
  }

  return (
    <section
      style={{
        padding: '1.25rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 250, 242, 0.94)',
        border: '1px solid var(--color-border)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {[
              'Part number',
              'Description',
              'Vendor',
              'Category',
              'Total quantity',
              'Status',
              'Supplier selected',
              'Quoted price',
              'PO number',
              'Notes',
            ].map((label) => (
              <th
                key={label}
                style={{
                  padding: '0.85rem 0.5rem',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.aggregateKey}>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.partNumber}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.partDescription}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.vendor}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.partCategory}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.totalQuantity}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.status}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.supplierSelected ?? 'Not set'}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.quotedPrice === null ? 'Not set' : `$${row.quotedPrice.toFixed(2)}`}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.poNumber ?? 'Not set'}
              </td>
              <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                {row.notes ?? 'Not set'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
