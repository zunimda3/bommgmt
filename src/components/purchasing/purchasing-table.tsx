'use client';

import { useState } from 'react';
import { rowMatchesFilters } from '@/lib/table-filters';

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

type PurchasingFilters = {
  notes: string;
  partCategory: string;
  partDescription: string;
  partNumber: string;
  poNumber: string;
  quotedPrice: string;
  status: string;
  supplierSelected: string;
  totalQuantity: string;
  vendor: string;
};

const initialFilters: PurchasingFilters = {
  partNumber: '',
  partDescription: '',
  vendor: '',
  partCategory: '',
  totalQuantity: '',
  status: '',
  supplierSelected: '',
  quotedPrice: '',
  poNumber: '',
  notes: '',
};

const filterCellStyle = {
  padding: '0.65rem 0.5rem 0.85rem',
  borderBottom: '1px solid var(--color-border)',
};

const filterControlStyle = {
  width: '100%',
  minWidth: '110px',
  padding: '0.55rem 0.65rem',
  borderRadius: '0.75rem',
  border: '1px solid var(--color-border)',
  background: '#fffaf2',
};

export function PurchasingTable({ rows }: PurchasingTableProps) {
  const [filters, setFilters] = useState<PurchasingFilters>(initialFilters);

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

  const filteredRows = rows.filter((row) =>
    rowMatchesFilters({
      row: {
        partNumber: row.partNumber,
        partDescription: row.partDescription,
        vendor: row.vendor,
        partCategory: row.partCategory,
        totalQuantity: row.totalQuantity,
        status: row.status,
        supplierSelected: row.supplierSelected ?? 'Not set',
        quotedPrice: row.quotedPrice === null ? 'Not set' : `$${row.quotedPrice.toFixed(2)}`,
        poNumber: row.poNumber ?? 'Not set',
        notes: row.notes ?? 'Not set',
      },
      filters,
      dropdownKeys: ['partCategory', 'status'],
    }),
  );

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
          <tr>
            <th style={filterCellStyle}>
              <input
                aria-label="Part number filter"
                onChange={(event) => setFilters((current) => ({ ...current, partNumber: event.target.value }))}
                style={filterControlStyle}
                type="text"
                value={filters.partNumber}
              />
            </th>
            <th style={filterCellStyle}>
              <input
                aria-label="Description filter"
                onChange={(event) =>
                  setFilters((current) => ({ ...current, partDescription: event.target.value }))
                }
                style={filterControlStyle}
                type="text"
                value={filters.partDescription}
              />
            </th>
            <th style={filterCellStyle}>
              <input
                aria-label="Vendor filter"
                onChange={(event) => setFilters((current) => ({ ...current, vendor: event.target.value }))}
                style={filterControlStyle}
                type="text"
                value={filters.vendor}
              />
            </th>
            <th style={filterCellStyle}>
              <select
                aria-label="Category filter"
                onChange={(event) => setFilters((current) => ({ ...current, partCategory: event.target.value }))}
                style={filterControlStyle}
                value={filters.partCategory}
              >
                <option value="">All</option>
                <option value="fabrication">fabrication</option>
                <option value="standard_part">standard_part</option>
                <option value="modifications">modifications</option>
              </select>
            </th>
            <th style={filterCellStyle}>
              <input
                aria-label="Total quantity filter"
                onChange={(event) => setFilters((current) => ({ ...current, totalQuantity: event.target.value }))}
                style={filterControlStyle}
                type="text"
                value={filters.totalQuantity}
              />
            </th>
            <th style={filterCellStyle}>
              <select
                aria-label="Status filter"
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                style={filterControlStyle}
                value={filters.status}
              >
                <option value="">All</option>
                <option value="pending">pending</option>
                <option value="quoted">quoted</option>
                <option value="ordered">ordered</option>
                <option value="received">received</option>
              </select>
            </th>
            <th style={filterCellStyle}>
              <input
                aria-label="Supplier selected filter"
                onChange={(event) =>
                  setFilters((current) => ({ ...current, supplierSelected: event.target.value }))
                }
                style={filterControlStyle}
                type="text"
                value={filters.supplierSelected}
              />
            </th>
            <th style={filterCellStyle}>
              <input
                aria-label="Quoted price filter"
                onChange={(event) => setFilters((current) => ({ ...current, quotedPrice: event.target.value }))}
                style={filterControlStyle}
                type="text"
                value={filters.quotedPrice}
              />
            </th>
            <th style={filterCellStyle}>
              <input
                aria-label="PO number filter"
                onChange={(event) => setFilters((current) => ({ ...current, poNumber: event.target.value }))}
                style={filterControlStyle}
                type="text"
                value={filters.poNumber}
              />
            </th>
            <th style={filterCellStyle}>
              <input
                aria-label="Notes filter"
                onChange={(event) => setFilters((current) => ({ ...current, notes: event.target.value }))}
                style={filterControlStyle}
                type="text"
                value={filters.notes}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
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
