'use client';

import { useState } from 'react';
import { updatePurchasingWorkflowFromForm } from '@/server/actions/purchasing';

type PurchasingWorkflowFormProps = {
  canEdit: boolean;
  projectId: string;
  rows: Array<{
    aggregateKey: string;
    notes: string | null;
    partNumber: string;
    poNumber: string | null;
    quotedPrice: number | null;
    status: 'pending' | 'quoted' | 'ordered' | 'received';
    supplierSelected: string | null;
  }>;
};

export function PurchasingWorkflowForm({ canEdit, projectId, rows }: PurchasingWorkflowFormProps) {
  if (!canEdit) {
    return (
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>
        Purchasers can update workflow fields here. Designers have read-only access.
      </p>
    );
  }

  if (!rows.length) {
    return <p style={{ margin: 0, color: 'var(--color-muted)' }}>No purchasing rows available yet.</p>;
  }

  const action = updatePurchasingWorkflowFromForm.bind(null, projectId);
  const [selectedAggregateKey, setSelectedAggregateKey] = useState(rows[0].aggregateKey);
  const selectedRow = rows.find((row) => row.aggregateKey === selectedAggregateKey) ?? rows[0];

  return (
    <form
      action={action}
      style={{
        display: 'grid',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: '1.25rem',
        background: 'rgba(255, 250, 242, 0.94)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h2 style={{ margin: 0 }}>Update purchasing workflow</h2>
      <select
        aria-label="Purchasing item"
        name="aggregateKey"
        onChange={(event) => {
          setSelectedAggregateKey(event.target.value);
        }}
        style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
        value={selectedRow.aggregateKey}
      >
        {rows.map((row) => (
          <option key={row.aggregateKey} value={row.aggregateKey}>
            {row.partNumber}
          </option>
        ))}
      </select>
      <div key={selectedRow.aggregateKey} style={{ display: 'grid', gap: '0.75rem' }}>
        <select
          aria-label="Purchasing status"
          defaultValue={selectedRow.status}
          name="status"
          style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
        >
          <option value="pending">Pending</option>
          <option value="quoted">Quoted</option>
          <option value="ordered">Ordered</option>
          <option value="received">Received</option>
        </select>
        <input
          aria-label="Supplier selected"
          defaultValue={selectedRow.supplierSelected ?? ''}
          name="supplierSelected"
          placeholder="Supplier selected"
          required
          style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
          type="text"
        />
        <input
          aria-label="Quoted price"
          defaultValue={selectedRow.quotedPrice === null ? '' : selectedRow.quotedPrice}
          min="0"
          name="quotedPrice"
          placeholder="Quoted price"
          required
          step="0.01"
          style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
          type="number"
        />
        <input
          aria-label="PO number"
          defaultValue={selectedRow.poNumber ?? ''}
          name="poNumber"
          placeholder="PO number"
          required
          style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
          type="text"
        />
        <textarea
          aria-label="Purchasing notes"
          defaultValue={selectedRow.notes ?? ''}
          name="notes"
          placeholder="Notes"
          required
          rows={3}
          style={{ padding: '0.75rem 0.9rem', borderRadius: '0.9rem', border: '1px solid var(--color-border)' }}
        />
      </div>
      <button
        type="submit"
        style={{
          justifySelf: 'start',
          padding: '0.85rem 1.1rem',
          border: 'none',
          borderRadius: '999px',
          background: '#1f1b16',
          color: '#fffaf2',
          cursor: 'pointer',
        }}
      >
        Save purchasing workflow
      </button>
    </form>
  );
}
