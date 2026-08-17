import { Component, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { injectLogout } from '../auth/auth-client';

@Component({
  selector: 'app-dashboard-header',
  imports: [HlmSidebarImports, HlmButtonImports],
  template: `
    <header
      class="sticky top-0 z-10 flex h-(--header-height) items-center gap-2 px-4"
    >
      <button hlmSidebarTrigger></button>
      <span class="text-semibold text-lg">{{ title() }}</span>

      <div class="ml-auto flex gap-1">
        <button hlmBtn variant="outline" size="sm" (click)="logout()">
          Logout
        </button>
      </div>
    </header>
  `,
})
export class DashboardHeader {
  readonly logout = injectLogout();

  title = input<string>();
}
