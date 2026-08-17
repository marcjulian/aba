import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePanda, lucideUsers2 } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { injectIsAdmin } from '../auth/auth-client';
import { DashboardHeader } from './dashboard-header';
import { ImpersonationBanner } from './impersonation-banner';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    HlmSidebarImports,
    RouterLink,
    NgIcon,
    DashboardHeader,
    ImpersonationBanner,
  ],
  providers: [provideIcons({ lucidePanda, lucideUsers2 })],
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
          @if (isAdmin()) {
            <hlm-sidebar-group>
              <div hlmSidebarGroupLabel>Admin</div>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuSubButton routerLink="/admin">
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
        <ng-content />
      </main>
    </div>
  `,
})
export class DashboardLayout {
  readonly isAdmin = injectIsAdmin();

  readonly title = input<string>();
}
