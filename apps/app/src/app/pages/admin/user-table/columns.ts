import { createColumnHelper } from '@tanstack/angular-table';
import type { UserWithRole } from 'better-auth/plugins/admin';
import {
  TableHeadSelection,
  TableRowSelection,
} from '../../../ui/table/selection-column';
import { TableHeadSortButton } from '../../../ui/table/sort-header-button';
import { UserActionDropdown } from './user-action-dropdown';
import { UserRoleBadge } from './user-role-badge';
import type { UserTableFeatures } from './user-table-features';
import { UserVerifiedBadge } from './user-verified-badge';

const columnHelper = createColumnHelper<UserTableFeatures, UserWithRole>();

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const userColumns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: () => TableHeadSelection,
    cell: () => TableRowSelection,
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Name',
  }),
  columnHelper.accessor('email', {
    id: 'email',
    meta: { label: 'Email' },
    header: () => TableHeadSortButton,
  }),
  columnHelper.accessor('emailVerified', {
    id: 'emailVerified',
    header: 'Verified',
    cell: () => UserVerifiedBadge,
  }),
  columnHelper.accessor('role', {
    id: 'role',
    header: 'Role',
    cell: () => UserRoleBadge,
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    meta: { label: 'Created' },
    header: () => TableHeadSortButton,
    cell: (info) => dateTimeFormatter.format(info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => UserActionDropdown,
  }),
]);
