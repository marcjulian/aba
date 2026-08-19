import {
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/angular-table';

interface UserColumnMeta {
  label: string;
}

export const userTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnMeta: {} as UserColumnMeta,
});

export type UserTableFeatures = typeof userTableFeatures;
