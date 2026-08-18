import {
  Component,
  debounced,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
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
    NgIcon,
  ],
  providers: [provideIcons({ lucideSearch, lucideX })],
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
        <!-- TODO add pagination -->
      </div>
    </div>
  `,
})
export class UserTable {
  private readonly authClient = injectAuthClient();
  private readonly router = inject(Router);

  readonly _columns = userColumns;

  readonly sort = input<SortingState, string>([], { transform: parseSort });
  readonly q = input<string, string | undefined>('', {
    transform: (value) => value ?? '',
  });

  protected readonly query = linkedSignal(this.q);
  private readonly debouncedQuery = debounced(this.query, 300);

  constructor() {
    effect(() => {
      const value = this.debouncedQuery.value();
      this.router.navigate([], {
        queryParams: { q: value?.trim() || undefined },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    injectTanStackTableDevtools(() => ({
      table: this._table,
    }));
  }

  protected onSearchInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onResetSearch(): void {
    this.query.set('');
  }

  private readonly usersQuery = injectQuery(() => ({
    queryKey: ['users', this.sort(), this.q()],
    queryFn: () => {
      const [sort] = this.sort();
      const q = this.q().trim();
      return this.authClient.admin.listUsers({
        query: {
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
    features: userTableFeatures,
    columns: userColumns,
    data: this.usersQuery.data()?.data?.users ?? [],
    state: {
      sorting: this.sort(),
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
  }));
}
