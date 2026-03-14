import { rowMatchesFilters } from '@/lib/table-filters';

test('matches text filters using case-insensitive partial matching', () => {
  const matches = rowMatchesFilters({
    row: {
      vendor: 'Acme Metals',
    },
    filters: {
      vendor: 'acme',
    },
    dropdownKeys: [],
  });

  expect(matches).toBe(true);
});

test('matches dropdown filters using exact values', () => {
  const matches = rowMatchesFilters({
    row: {
      status: 'ordered',
    },
    filters: {
      status: 'ordered',
    },
    dropdownKeys: ['status'],
  });

  expect(matches).toBe(true);
});

test('requires rows to satisfy all active filters', () => {
  const matches = rowMatchesFilters({
    row: {
      vendor: 'Acme Metals',
      status: 'ordered',
    },
    filters: {
      vendor: 'acme',
      status: 'quoted',
    },
    dropdownKeys: ['status'],
  });

  expect(matches).toBe(false);
});

test('treats empty filters as no filter', () => {
  const matches = rowMatchesFilters({
    row: {
      vendor: 'Acme Metals',
      status: 'ordered',
    },
    filters: {
      vendor: '',
      status: '',
    },
    dropdownKeys: ['status'],
  });

  expect(matches).toBe(true);
});
