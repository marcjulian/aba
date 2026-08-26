import { NumberInput } from '@angular/cdk/coercion';
import {
  Component,
  computed,
  debounced,
  effect,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideUsers, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import {
  FlexRender,
  injectTable,
  isFunction,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  TanStackTable,
} from '@tanstack/angular-table';
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools';
import { injectAuthClient } from '../../../auth/auth-client';
import { parseSort, serializeSort } from '../../../tools/table/sort';
import { TablePaginaton } from '../../../ui/table/pagination';
import { SearchInput } from '../../../ui/table/search-input';
import { TableSelectionActions } from '../../../ui/table/selection-actions';
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
    TanStackTable,
    NgIcon,
    TableSelectionActions,
    TablePaginaton,
    SearchInput,
  ],
  providers: [
    provideIcons({
      lucideSearch,
      lucideX,
      lucideUsers,
    }),
  ],
  host: { class: 'flex flex-col gap-3' },
  template: `
    <div
      class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
    >
      <app-search-input
        [query]="inputValue()"
        (queryChange)="query.set($event)"
        (resetQuery)="query.set('')"
      />

      @if (_table.getSelectedRowModel().rows.length; as rowLength) {
        <app-table-selection-actions
          [count]="rowLength"
          (confirmed)="deleteSelected()"
        />
      }
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
    <div [tanStackTable]="_table">
      <app-table-pagination />
    </div>
  `,
})
export class UserTable {
  private readonly authClient = injectAuthClient();
  private readonly router = inject(Router);

  readonly _columns = userColumns;

  protected readonly _availablePageSizes = [10, 20, 50, 100];

  readonly page = input<number, NumberInput>(1, {
    transform: (value) => numberAttribute(value, 1),
  });
  readonly size = input<number, NumberInput>(20, {
    transform: (value) => numberAttribute(value, 20),
  });

  private readonly pagination = computed<PaginationState>(() => {
    const page = this.page();
    return {
      pageIndex: page - 1,
      pageSize: this.size(),
    };
  });

  readonly sort = input<SortingState, string>([], { transform: parseSort });
  readonly q = input<string | undefined>(undefined);

  protected readonly query = linkedSignal(this.q);
  private readonly debouncedQuery = debounced(this.query, 300);

  protected readonly inputValue = computed(() => this.query() ?? '');

  private readonly rowSelection = signal<RowSelectionState>({});

  private readonly usersQuery = injectQuery(() => ({
    queryKey: ['users', this.sort(), this.q(), this.pagination()],
    queryFn: async () => {
      const [sort] = this.sort();
      const q = this.q()?.trim();
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
    enableRowSelection: (row) => row.original.role !== 'admin',
    state: {
      sorting: this.sort(),
      pagination: this.pagination(),
      rowSelection: this.rowSelection(),
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
    onRowSelectionChange: (updater) => {
      isFunction(updater)
        ? this.rowSelection.update(updater)
        : this.rowSelection.set(updater);
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
      const value = this.debouncedQuery.value() ?? '';
      const q = value.trim();

      if (q === (this.q() ?? '').trim()) {
        return;
      }

      this.router.navigate([], {
        queryParams: { q: q || undefined, page: 1 },
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

  protected async deleteSelected(): Promise<void> {
    const selectedRows = this._table.getSelectedRowModel().rows;

    for (const row of selectedRows) {
      await this.authClient.admin.removeUser({ userId: row.original.id });
    }

    this.rowSelection.set({});
    await this.usersQuery.refetch();
  }
}
