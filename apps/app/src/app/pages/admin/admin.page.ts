import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardLayout } from '../../layouts/dashboard.layout';
import { AdminStats } from './admin-stats';

@Component({
  selector: 'app-admin',
  imports: [DashboardLayout, AdminStats],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-layout>
      <app-admin-stats class="px-4 pt-4" />
    </app-dashboard-layout>
  `,
})
export class AdminPage {}
