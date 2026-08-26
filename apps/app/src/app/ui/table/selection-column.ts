import { Component, computed } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import {
  injectTableCellContext,
  injectTableContext,
} from '@tanstack/angular-table';

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
    'aria-label': 'Select all',
  },
  template: `
    <hlm-checkbox
      [checked]="table().getIsAllRowsSelected()"
      [indeterminate]="
        table().getIsSomeRowsSelected() && !table().getIsAllPageRowsSelected()
      "
      (checkedChange)="table().toggleAllPageRowsSelected($event)"
    />
  `,
})
export class TableHeadSelection {
  readonly table = injectTableContext();
}

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
    'aria-label': 'Select Row',
  },
  template: `
    <hlm-checkbox
      [disabled]="disabled()"
      [checked]="cell().row.getIsSelected()"
      (checkedChange)="cell().row.toggleSelected($event)"
    />
  `,
})
export class TableRowSelection {
  readonly cell = injectTableCellContext();

  readonly disabled = computed(() => !this.cell().row.getCanSelect());
}
