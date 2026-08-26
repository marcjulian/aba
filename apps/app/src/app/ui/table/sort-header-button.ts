import { Component, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideArrowUpDown,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { injectTableHeaderContext } from '@tanstack/angular-table';

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
      {{ label() }}
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
  private readonly header = injectTableHeaderContext();

  readonly column = computed(() => this.header().column);

  protected readonly label = computed(() => {
    const meta = this.column().columnDef.meta as
      | Record<string, unknown>
      | undefined;
    const label = meta?.['label'] as string | undefined;
    return label ?? this.column().id;
  });

  protected filterClick() {
    this.column().toggleSorting();
  }
}
