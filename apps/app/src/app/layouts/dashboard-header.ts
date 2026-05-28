import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCat } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { injectAuthUser, injectLogout } from '../auth/auth-client';

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink, HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucideCat })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="bg-background/40 sticky top-0 z-10 flex h-(--header-height) items-center gap-2 px-4 backdrop-blur-lg"
    >
      <a routerLink="/" hlmBtn variant="ghost" size="sm">
        <ng-icon name="lucideCat" />
        aba
      </a>

      <!-- <nav>
      </nav> -->

      <div class="ml-auto flex gap-1">
        @if (isAdmin()) {
          <a routerLink="/admin" hlmBtn variant="outline" size="sm">Admin</a>
        }
        <button hlmBtn variant="outline" size="sm" (click)="logout()">
          Logout
        </button>
      </div>
    </header>
  `,
})
export class DashboardHeader {
  readonly logout = injectLogout();
  readonly user = injectAuthUser();

  isAdmin = computed(() => this.user()?.role === 'admin');
}
