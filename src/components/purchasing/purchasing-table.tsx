import type { AggregatePurchasingRow } from '@/lib/purchasing/aggregate';

type PurchasingTableProps = {
  rows: AggregatePurchasingRow[];
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
            {['Part number', 'Description', 'Vendor', 'Category', 'Total quantity'].map((label) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
