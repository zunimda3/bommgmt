type ModuleTableProps = {
  module: {
    bomItems: Array<{
      id: string;
      itemCode: number;
      partCategory: string;
      partDescription: string;
      partNumber: string;
      price: number | { toString(): string };
      quantity: number;
      vendor: string;
    }>;
    id: string;
    name: string;
  };
};

export function ModuleTable({ module }: ModuleTableProps) {
  return (
    <section
      style={{
        display: 'grid',
        gap: '0.75rem',
        padding: '1.25rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 250, 242, 0.94)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{module.name}</h2>
        <input
          aria-label={`${module.name} filter`}
          placeholder="Filter items"
          style={{
            minWidth: '180px',
            padding: '0.7rem 0.9rem',
            borderRadius: '999px',
            border: '1px solid var(--color-border)',
          }}
          type="search"
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Part number', 'Part description', 'Vendor', 'Part category', 'Quantity', 'Price'].map((label) => (
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
            {module.bomItems.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                  {item.itemCode}
                </td>
                <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                  {item.partNumber}
                </td>
                <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                  {item.partDescription}
                </td>
                <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                  {item.vendor}
                </td>
                <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                  {item.partCategory}
                </td>
                <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid rgba(220, 205, 184, 0.5)' }}>
                  {Number(item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
