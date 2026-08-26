import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
  selector: 'app-search-input',
  imports: [HlmInputGroupImports, NgIcon],
  providers: [provideIcons({ lucideSearch, lucideX })],
  template: `
    <hlm-input-group class="w-full md:w-80">
      <input
        hlmInputGroupInput
        placeholder="Search by email..."
        [value]="query()"
        (input)="searchInput($event)"
      />
      <hlm-input-group-addon>
        <ng-icon name="lucideSearch" />
      </hlm-input-group-addon>
      @if (query()) {
        <hlm-input-group-addon align="inline-end">
          <button
            hlmInputGroupButton
            aria-label="Clear search"
            size="icon-xs"
            (click)="resetQuery.emit()"
          >
            <ng-icon name="lucideX" />
          </button>
        </hlm-input-group-addon>
      }
    </hlm-input-group>
  `,
})
export class SearchInput {
  readonly query = input<string>();

  readonly queryChange = output<string>();
  readonly resetQuery = output();

  protected searchInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }
}
