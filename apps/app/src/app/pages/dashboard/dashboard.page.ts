import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { injectAuthUser } from '../../auth/auth-client';
import { DashboardLayout } from '../../layouts/dashboard.layout';

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardLayout, HlmButtonImports, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-layout>
      <h1>Dashboard Page</h1>
      <div>
        <pre>
        {{ user() | json }}
      </pre
        >
      </div>
    </app-dashboard-layout>
  `,
})
export class DashboardPage {
  readonly user = injectAuthUser();
}
