import { fireEvent, render, screen } from '@testing-library/react';
import { ModuleTable } from '@/components/bom/module-table';

test('renders bom header filters and filters rows within a module', () => {
  render(
    <ModuleTable
      module={{
        id: 'module-1',
        name: 'Conveyor Frame',
        bomItems: [
          {
            id: 'item-1',
            itemCode: 1,
            partNumber: 'CF-100',
            partDescription: 'Frame rail',
            vendor: 'Acme Metals',
            partCategory: 'fabrication',
            quantity: 2,
            price: 140,
          },
          {
            id: 'item-2',
            itemCode: 2,
            partNumber: 'CF-200',
            partDescription: 'Leveling foot',
            vendor: 'Budget Parts',
            partCategory: 'standard_part',
            quantity: 4,
            price: 18,
          },
        ],
      }}
    />,
  );

  expect(screen.queryByPlaceholderText(/filter items/i)).not.toBeInTheDocument();
  expect(screen.getByLabelText(/conveyor frame id filter/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/conveyor frame part number filter/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/conveyor frame part category filter/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/conveyor frame vendor filter/i), {
    target: { value: 'acme' },
  });

  expect(screen.getByText('CF-100')).toBeInTheDocument();
  expect(screen.queryByText('CF-200')).not.toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/conveyor frame vendor filter/i), {
    target: { value: '' },
  });
  fireEvent.change(screen.getByLabelText(/conveyor frame part category filter/i), {
    target: { value: 'standard_part' },
  });

  expect(screen.queryByText('CF-100')).not.toBeInTheDocument();
  expect(screen.getByText('CF-200')).toBeInTheDocument();
});
