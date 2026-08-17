import type { SortingState } from '@tanstack/angular-table';

export function parseSort(value: string | undefined): SortingState {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((part) => {
      const [id, direction] = part.split('.');
      return { id, desc: direction === 'desc' };
    })
    .filter((s) => s.id);
}

export function serializeSort(sorting: SortingState): string | undefined {
  console.log('serializeSort', sorting);
  if (sorting.length === 0) {
    return undefined;
  }

  return sorting.map((s) => `${s.id}.${s.desc ? 'desc' : 'asc'}`).join(',');
}
