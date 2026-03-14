import { render, screen } from '@testing-library/react';
import { PurchasingTable } from '@/components/purchasing/purchasing-table';

test('renders purchasing workflow fields directly in the table', () => {
  render(
    <PurchasingTable
      rows={[
        {
          aggregateKey: 'PRJ-1001|CF-100|Frame rail|Acme Metals|fabrication',
          projectId: 'PRJ-1001',
          partNumber: 'CF-100',
          partDescription: 'Frame rail',
          vendor: 'Acme Metals',
          partCategory: 'fabrication',
          totalQuantity: 2,
          status: 'quoted',
          supplierSelected: 'Best Supply',
          quotedPrice: 135.5,
          poNumber: 'PO-321',
          notes: 'Ready to order',
        },
        {
          aggregateKey: 'PRJ-1001|CF-200|Leveling foot|Acme Metals|standard_part',
          projectId: 'PRJ-1001',
          partNumber: 'CF-200',
          partDescription: 'Leveling foot',
          vendor: 'Acme Metals',
          partCategory: 'standard_part',
          totalQuantity: 4,
          status: 'pending',
          supplierSelected: null,
          quotedPrice: null,
          poNumber: null,
          notes: null,
        },
      ]}
    />,
  );

  expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /supplier selected/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /quoted price/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /po number/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /notes/i })).toBeInTheDocument();

  expect(screen.getByRole('cell', { name: 'quoted' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Best Supply' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: '$135.50' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'PO-321' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Ready to order' })).toBeInTheDocument();

  expect(screen.getAllByText('Not set')).toHaveLength(4);
});
