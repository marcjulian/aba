import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucidePanda,
  lucideUsers2,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { filter, map } from 'rxjs';
import { injectIsAdmin } from '../auth/auth-client';
import { DashboardHeader } from './dashboard-header';
import { ImpersonationBanner } from './impersonation-banner';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    HlmSidebarImports,
    RouterLink,
    NgIcon,
    DashboardHeader,
    ImpersonationBanner,
  ],
  providers: [
    provideIcons({ lucidePanda, lucideUsers2, lucideLayoutDashboard }),
  ],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar variant="inset">
        <hlm-sidebar-header>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton size="lg" routerLink="/dashboard">
                <ng-icon name="lucidePanda" class="text-base" />
                <span>aba</span>
              </a>
            </li>
          </ul>
        </hlm-sidebar-header>
        <hlm-sidebar-content>
          <hlm-sidebar-group>
            <ul hlmSidebarMenu>
              <li hlmSidebarMenuItem>
                <a
                  hlmSidebarMenuSubButton
                  routerLink="/dashboard"
                  [isActive]="currentPath() === '/dashboard'"
                >
                  <ng-icon name="lucideLayoutDashboard" />
                  Dashboard
                </a>
              </li>
            </ul>
          </hlm-sidebar-group>
          @if (isAdmin()) {
            <hlm-sidebar-group>
              <div hlmSidebarGroupLabel>Admin</div>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <a
                    hlmSidebarMenuSubButton
                    routerLink="/admin/users"
                    [isActive]="currentPath() === '/admin/users'"
                  >
                    <ng-icon name="lucideUsers2" />
                    Users
                  </a>
                </li>
              </ul>
            </hlm-sidebar-group>
          }
        </hlm-sidebar-content>
      </hlm-sidebar>
      <main hlmSidebarInset>
        <app-dashboard-header [title]="title()" />
        <app-impersonation-banner />
        <router-outlet />
      </main>
    </div>
  `,
})
export class DashboardLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isAdmin = injectIsAdmin();

  readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  readonly title = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.getLeafTitle()),
    ),
    { initialValue: this.getLeafTitle() },
  );

  private getLeafTitle(): string | undefined {
    let route = this.route;
    while (route.firstChild) route = route.firstChild;
    return route.snapshot?.title ?? undefined;
  }
}
