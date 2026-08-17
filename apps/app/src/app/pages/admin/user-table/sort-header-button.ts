import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideArrowUpDown,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { type Column } from '@tanstack/angular-table';
import type { User } from 'better-auth';
import type { UserTableFeatures } from './user-table-features';

@Component({
  imports: [HlmButtonImports, NgIcon],
  providers: [
    provideIcons({ lucideArrowDown, lucideArrowUp, lucideArrowUpDown }),
  ],
  template: `
    <button
      hlmBtn
      size="sm"
      variant="ghost"
      class="capitalize"
      (click)="filterClick()"
    >
      {{ column().columnDef.meta?.label ?? column().id }}
      @if (column().getIsSorted() === 'asc') {
        <ng-icon name="lucideArrowUp" />
      } @else if (column().getIsSorted() === 'desc') {
        <ng-icon name="lucideArrowDown" />
      } @else {
        <ng-icon name="lucideArrowUpDown" />
      }
    </button>
  `,
})
export class TableHeadSortButton {
  public readonly column =
    input.required<Column<UserTableFeatures, User, unknown>>();

  protected filterClick() {
    this.column().toggleSorting();
  }
}
