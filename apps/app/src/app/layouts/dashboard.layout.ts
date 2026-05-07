import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DashboardHeader } from './dashboard-header';

@Component({
  selector: 'app-dashboard-layout',
  imports: [HlmButtonImports, DashboardHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-header />
    <main class="mx-auto max-w-(--breakpoint-lg) px-4">
      <ng-content />
    </main>
  `,
})
export class DashboardLayout {}
