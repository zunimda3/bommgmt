type FilterValue = string;

type RowMatchesFiltersInput = {
  dropdownKeys: string[];
  filters: Record<string, FilterValue>;
  row: Record<string, unknown>;
};

function normalizeCellValue(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

export function rowMatchesFilters({ row, filters, dropdownKeys }: RowMatchesFiltersInput) {
  return Object.entries(filters).every(([key, filterValue]) => {
    if (!filterValue) {
      return true;
    }

    const normalizedFilter = normalizeCellValue(filterValue);
    const normalizedCell = normalizeCellValue(row[key]);

    if (dropdownKeys.includes(key)) {
      return normalizedCell === normalizedFilter;
    }

    return normalizedCell.includes(normalizedFilter);
  });
}
