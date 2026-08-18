import { Component, input } from '@angular/core';
import { DashboardLayout } from '../../layouts/dashboard.layout';
import { AdminStats } from './admin-stats';
import { UserTable } from './user-table/user-table';

@Component({
  selector: 'app-admin-users',
  imports: [DashboardLayout, AdminStats, UserTable],
  template: `
    <app-dashboard-layout title="Users">
      <div class="flex flex-col gap-4 px-4 pt-4">
        <app-admin-stats />
        <app-user-table [q]="q()" [sort]="sort()" />
      </div>
    </app-dashboard-layout>
  `,
})
export class AdminUsersPage {
  readonly sort = input<string>('');
  readonly q = input<string>('');
}
