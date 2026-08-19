import { NumberInput } from '@angular/cdk/coercion';
import { Component, input, numberAttribute } from '@angular/core';
import { AdminStats } from './admin-stats';
import { UserTable } from './user-table/user-table';

@Component({
  selector: 'app-admin-users',
  imports: [AdminStats, UserTable],
  template: `
    <div class="flex flex-col gap-4 px-4 pt-4">
      <app-admin-stats />
      <app-user-table
        [q]="q()"
        [sort]="sort()"
        [page]="page()"
        [size]="size()"
      />
    </div>
  `,
})
export class AdminUsersPage {
  readonly sort = input<string>('');
  readonly q = input<string>('');
  readonly page = input<number, NumberInput>(undefined, {
    transform: numberAttribute,
  });
  readonly size = input<number, NumberInput>(undefined, {
    transform: numberAttribute,
  });
}
