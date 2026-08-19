import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { injectTableContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-table-pagination',
  imports: [HlmLabel, HlmButton, HlmSelectImports, NgIcon],
  providers: [
    provideIcons({
      lucideChevronsLeft,
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsRight,
    }),
  ],
  host: { class: 'justify-end flex items-center gap-4' },
  template: `
    <div class="flex gap-2">
      <span hlmLabel>Rows per page</span>
      <hlm-select
        [value]="table().atoms.pagination.get().pageSize"
        (valueChange)="changePageSize($event)"
      >
        <hlm-select-trigger size="sm" class="mr-1 inline-flex h-8 w-fit">
          <hlm-select-value placeholder="{{ pageSizes()[0] }}" />
        </hlm-select-trigger>
        <hlm-select-content *hlmSelectPortal>
          <hlm-select-group>
            @for (size of pageSizes(); track size) {
              <hlm-select-item [value]="size">
                {{ size }}
              </hlm-select-item>
            }
          </hlm-select-group>
        </hlm-select-content>
      </hlm-select>
    </div>
    <span hlmLabel>
      Page {{ table().atoms.pagination.get().pageIndex + 1 }} of
      {{ table().getPageCount() }}
    </span>
    <div class="flex gap-2">
      <button
        hlmBtn
        size="icon-sm"
        variant="outline"
        [disabled]="!table().getCanPreviousPage()"
        (click)="table().firstPage()"
      >
        <span class="sr-only">First page</span>
        <ng-icon name="lucideChevronsLeft" />
      </button>
      <button
        hlmBtn
        size="icon-sm"
        variant="outline"
        [disabled]="!table().getCanPreviousPage()"
        (click)="table().previousPage()"
      >
        <span class="sr-only">Previous page</span>
        <ng-icon name="lucideChevronLeft" />
      </button>
      <button
        hlmBtn
        size="icon-sm"
        variant="outline"
        [disabled]="!table().getCanNextPage()"
        (click)="table().nextPage()"
      >
        <span class="sr-only">Next page</span>
        <ng-icon name="lucideChevronRight" />
      </button>
      <button
        hlmBtn
        size="icon-sm"
        variant="outline"
        [disabled]="!table().getCanNextPage()"
        (click)="table().lastPage()"
      >
        <span class="sr-only">Last page</span>
        <ng-icon name="lucideChevronsRight" />
      </button>
    </div>
  `,
})
export class TablePaginaton {
  private readonly router = inject(Router);
  readonly table = injectTableContext();

  pageSizes = input([10, 20, 50, 100]);

  protected changePageSize(pageSize: number | undefined | null) {
    this.router.navigate([], {
      queryParams: { size: pageSize ?? 10, page: 1 },
      queryParamsHandling: 'merge',
    });
  }
}
