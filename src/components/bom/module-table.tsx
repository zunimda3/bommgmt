'use client';

import { useState } from 'react';
import { rowMatchesFilters } from '@/lib/table-filters';

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

type BomFilters = {
  itemCode: string;
  partCategory: string;
  partDescription: string;
  partNumber: string;
  price: string;
  quantity: string;
  vendor: string;
};

const initialFilters: BomFilters = {
  itemCode: '',
  partNumber: '',
  partDescription: '',
  vendor: '',
  partCategory: '',
  quantity: '',
  price: '',
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

export function ModuleTable({ module }: ModuleTableProps) {
  const [filters, setFilters] = useState<BomFilters>(initialFilters);

  const filteredItems = module.bomItems.filter((item) =>
    rowMatchesFilters({
      row: {
        itemCode: item.itemCode,
        partNumber: item.partNumber,
        partDescription: item.partDescription,
        vendor: item.vendor,
        partCategory: item.partCategory,
        quantity: item.quantity,
        price: Number(item.price).toFixed(2),
      },
      filters,
      dropdownKeys: ['partCategory'],
    }),
  );

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
            <tr>
              <th style={filterCellStyle}>
                <input
                  aria-label={`${module.name} ID filter`}
                  onChange={(event) => setFilters((current) => ({ ...current, itemCode: event.target.value }))}
                  style={filterControlStyle}
                  type="text"
                  value={filters.itemCode}
                />
              </th>
              <th style={filterCellStyle}>
                <input
                  aria-label={`${module.name} Part number filter`}
                  onChange={(event) => setFilters((current) => ({ ...current, partNumber: event.target.value }))}
                  style={filterControlStyle}
                  type="text"
                  value={filters.partNumber}
                />
              </th>
              <th style={filterCellStyle}>
                <input
                  aria-label={`${module.name} Part description filter`}
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
                  aria-label={`${module.name} Vendor filter`}
                  onChange={(event) => setFilters((current) => ({ ...current, vendor: event.target.value }))}
                  style={filterControlStyle}
                  type="text"
                  value={filters.vendor}
                />
              </th>
              <th style={filterCellStyle}>
                <select
                  aria-label={`${module.name} Part category filter`}
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
                  aria-label={`${module.name} Quantity filter`}
                  onChange={(event) => setFilters((current) => ({ ...current, quantity: event.target.value }))}
                  style={filterControlStyle}
                  type="text"
                  value={filters.quantity}
                />
              </th>
              <th style={filterCellStyle}>
                <input
                  aria-label={`${module.name} Price filter`}
                  onChange={(event) => setFilters((current) => ({ ...current, price: event.target.value }))}
                  style={filterControlStyle}
                  type="text"
                  value={filters.price}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
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
