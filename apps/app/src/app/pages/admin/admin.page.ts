import { Component, input } from '@angular/core';
import { DashboardLayout } from '../../layouts/dashboard.layout';
import { AdminStats } from './admin-stats';
import { UserTable } from './user-table/user-table';

@Component({
  selector: 'app-admin',
  imports: [DashboardLayout, AdminStats, UserTable],
  template: `
    <app-dashboard-layout>
      <app-admin-stats class="px-4 pt-4" />
      <app-user-table [q]="q()" [sort]="sort()" />
    </app-dashboard-layout>
  `,
})
export class AdminPage {
  readonly sort = input<string>('');
  readonly q = input<string>('');
}
