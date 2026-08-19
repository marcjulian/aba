import {
  Component,
  debounced,
  effect,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideSearch,
  lucideUsers,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import {
  FlexRender,
  injectTable,
  isFunction,
  PaginationState,
  SortingState,
} from '@tanstack/angular-table';
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools';
import { injectAuthClient } from '../../../auth/auth-client';
import { parseSort, serializeSort } from '../../../tools/table/sort';
import { userColumns } from './columns';
import { userTableFeatures } from './user-table-features';

@Component({
  selector: 'app-user-table',
  imports: [
    HlmButtonImports,
    HlmInputGroupImports,
    HlmTableImports,
    FlexRender,
    HlmEmptyImports,
    HlmSelectImports,
    HlmLabel,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideSearch,
      lucideX,
      lucideUsers,
      lucideChevronsLeft,
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsRight,
    }),
  ],
  host: { class: 'flex flex-col gap-3' },
  template: `
    <div class="flex items-center gap-2">
      <hlm-input-group class="w-full md:w-80">
        <input
          hlmInputGroupInput
          placeholder="Search by email..."
          [value]="query()"
          (input)="onSearchInput($event)"
        />
        <hlm-input-group-addon>
          <ng-icon name="lucideSearch" />
        </hlm-input-group-addon>
        @if (q()) {
          <hlm-input-group-addon align="inline-end">
            <button
              hlmInputGroupButton
              aria-label="Clear search"
              size="icon-xs"
              (click)="onResetSearch()"
            >
              <ng-icon name="lucideX" />
            </button>
          </hlm-input-group-addon>
        }
      </hlm-input-group>
    </div>

    <div class="overflow-hidden rounded-md border">
      <div hlmTableContainer>
        <table hlmTable>
          <thead hlmTHead>
            @for (
              headerGroup of _table.getHeaderGroups();
              track headerGroup.id
            ) {
              <tr hlmTr>
                @for (header of headerGroup.headers; track header.id) {
                  <th hlmTh [attr.colSpan]="header.colSpan">
                    @if (!header.isPlaceholder) {
                      <ng-container
                        *flexRender="
                          header.column.columnDef.header;
                          props: header.getContext();
                          let headerText
                        "
                      >
                        <div [innerHTML]="headerText"></div>
                      </ng-container>
                    }
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody hlmTBody>
            @for (row of _table.getRowModel().rows; track row.id) {
              <tr hlmTr [attr.key]="row.id">
                @for (cell of row.getAllCells(); track cell.id) {
                  <td hlmTd>
                    <ng-container
                      *flexRender="
                        cell.column.columnDef.cell;
                        props: cell.getContext();
                        let cell
                      "
                    >
                      <div [innerHTML]="cell"></div>
                    </ng-container>
                  </td>
                }
              </tr>
            } @empty {
              <tr hlmTr>
                <td
                  hlmTd
                  class="h-24 text-center"
                  [attr.colspan]="_columns.length"
                >
                  <hlm-empty class="border-0 py-10">
                    <hlm-empty-header>
                      <hlm-empty-media variant="icon">
                        <ng-icon name="lucideUsers" />
                      </hlm-empty-media>
                      <div hlmEmptyTitle>No users found</div>
                      <p hlmEmptyDescription>Try adjusting your search.</p>
                    </hlm-empty-header>
                    @if (q()) {
                      <hlm-empty-content>
                        <button
                          hlmBtn
                          variant="outline"
                          size="sm"
                          type="button"
                          (click)="onResetSearch()"
                        >
                          Clear search
                        </button>
                      </hlm-empty-content>
                    }
                  </hlm-empty>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
    <div class="ml-auto flex items-center gap-4">
      <div class="flex gap-2">
        <span hlmLabel>Rows per page</span>
        <hlm-select
          [value]="_table.atoms.pagination.get().pageSize"
          (valueChange)="changePageSize($event)"
        >
          <hlm-select-trigger size="sm" class="mr-1 inline-flex h-8 w-fit">
            <hlm-select-value placeholder="{{ _availablePageSizes[0] }}" />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            <hlm-select-group>
              @for (size of _availablePageSizes; track size) {
                <hlm-select-item [value]="size">
                  {{ size === 10000 ? 'All' : size }}
                </hlm-select-item>
              }
            </hlm-select-group>
          </hlm-select-content>
        </hlm-select>
      </div>
      <span hlmLabel>
        Page {{ _table.atoms.pagination.get().pageIndex + 1 }} of
        {{ _table.getPageCount() }}
      </span>
      <div class="flex gap-2">
        <button
          hlmBtn
          size="icon-sm"
          variant="outline"
          [disabled]="!_table.getCanPreviousPage()"
          (click)="_table.firstPage()"
        >
          <span class="sr-only">First page</span>
          <ng-icon name="lucideChevronsLeft" />
        </button>
        <button
          hlmBtn
          size="icon-sm"
          variant="outline"
          [disabled]="!_table.getCanPreviousPage()"
          (click)="_table.previousPage()"
        >
          <span class="sr-only">Previous page</span>
          <ng-icon name="lucideChevronLeft" />
        </button>
        <button
          hlmBtn
          size="icon-sm"
          variant="outline"
          [disabled]="!_table.getCanNextPage()"
          (click)="_table.nextPage()"
        >
          <span class="sr-only">Next page</span>
          <ng-icon name="lucideChevronRight" />
        </button>
        <button
          hlmBtn
          size="icon-sm"
          variant="outline"
          [disabled]="!_table.getCanNextPage()"
          (click)="_table.lastPage()"
        >
          <span class="sr-only">Last page</span>
          <ng-icon name="lucideChevronsRight" />
        </button>
      </div>
    </div>
  `,
})
export class UserTable {
  private readonly authClient = injectAuthClient();
  private readonly router = inject(Router);

  readonly _columns = userColumns;

  protected readonly _availablePageSizes = [10, 20, 50, 100];

  readonly page = input(1, {
    transform: (value) => numberAttribute(value, 1),
  });
  readonly size = input(2, {
    transform: (value) => numberAttribute(value, 2),
  });

  readonly pagination = linkedSignal<PaginationState>(() => {
    const page = this.page();
    return {
      pageIndex: page - 1,
      pageSize: this.size(),
    };
  });

  readonly sort = input<SortingState, string>([], { transform: parseSort });
  readonly q = input<string, string | undefined>('', {
    transform: (value) => value ?? '',
  });

  protected readonly query = linkedSignal(this.q);
  private readonly debouncedQuery = debounced(this.query, 300);

  private readonly usersQuery = injectQuery(() => ({
    queryKey: ['users', this.sort(), this.q(), this.pagination()],
    queryFn: async () => {
      const [sort] = this.sort();
      const q = this.q().trim();
      return this.authClient.admin.listUsers({
        query: {
          offset: this.pagination().pageIndex * this.pagination().pageSize,
          limit: this.pagination().pageSize,
          ...(sort
            ? { sortBy: sort.id, sortDirection: sort.desc ? 'desc' : 'asc' }
            : {}),
          ...(q
            ? {
                searchValue: q,
                searchField: 'email',
                searchOperator: 'contains',
              }
            : {}),
        },
      });
    },
    placeholderData: keepPreviousData,
  }));

  protected readonly _table = injectTable(() => ({
    key: 'users-table',
    features: userTableFeatures,
    columns: userColumns,
    data: this.usersQuery.data()?.data?.users ?? [],
    rowCount: this.usersQuery.data()?.data?.total,
    state: {
      sorting: this.sort(),
      pagination: this.pagination(),
    },
    onSortingChange: (updater) => {
      this.router.navigate([], {
        queryParams: {
          sort: serializeSort(
            isFunction(updater) ? updater(this.sort()) : updater,
          ),
        },
        queryParamsHandling: 'merge',
      });
    },
    onPaginationChange: (updater) => {
      this.router.navigate([], {
        queryParams: {
          page: isFunction(updater)
            ? updater(this.pagination()).pageIndex + 1
            : updater.pageIndex + 1,
        },
        queryParamsHandling: 'merge',
      });
    },
    manualPagination: true,
  }));

  constructor() {
    effect(() => {
      const value = this.debouncedQuery.value();
      this.router.navigate([], {
        queryParams: { q: value?.trim() || undefined, page: 1 },
        queryParamsHandling: 'merge',
      });
    });

    injectTanStackTableDevtools(() => ({
      table: this._table,
    }));
  }

  protected changePageSize(pageSize: number | undefined | null) {
    this.router.navigate([], {
      queryParams: { size: pageSize ?? 10, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  protected onSearchInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onResetSearch(): void {
    this.query.set('');
  }
}
