import { createColumnHelper } from '@tanstack/angular-table';
import type { User } from 'better-auth';
import { TableHeadSortButton } from './sort-header-button';
import type { UserTableFeatures } from './user-table-features';
import { UserVerifiedBadge } from './user-verified-badge';

const columnHelper = createColumnHelper<UserTableFeatures, User>();

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const userColumns = columnHelper.columns([
  columnHelper.accessor('email', {
    id: 'email',
    meta: { label: 'Email' },
    header: () => TableHeadSortButton,
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Name',
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    meta: { label: 'Created' },
    header: () => TableHeadSortButton,
    cell: (info) => dateTimeFormatter.format(info.getValue()),
  }),
  columnHelper.accessor('emailVerified', {
    id: 'emailVerified',
    header: 'Verified',
    cell: () => UserVerifiedBadge,
  }),
  // TODO actions dropdown menu (impersonate, delete)
]);
