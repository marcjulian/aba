import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, resource } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { injectAuthUser } from '../../auth/auth-client';
import { DashboardLayout } from '../../layouts/dashboard.layout';
import { injectTrpc } from '../../trpc/trpc.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardLayout, HlmButtonImports, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-layout>
      <h1>Dashboard Page</h1>
      <div class="flex flex-col gap-4">
        <div>
          <h2>Better Auth Session</h2>
          <pre>{{ user() | json }}</pre>
        </div>
        <div>
          <h2>tRPC — me</h2>
          <pre>{{ me.value() | json }}</pre>
        </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class DashboardPage {
  readonly user = injectAuthUser();
  readonly trpc = injectTrpc();

  me = resource({ loader: () => this.trpc.client.me.query() });
}
