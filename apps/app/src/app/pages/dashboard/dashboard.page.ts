import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { injectAuthClient, injectAuthUser } from '../../auth/auth-client';
import { DashboardLayout } from '../../layouts/dashboard.layout';

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardLayout, HlmButtonImports, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dashboard-layout>
      <h1>Dashboard Page</h1>

      <button hlmBtn variant="outline" size="sm" (click)="logout()">
        Logout
      </button>

      <div>
        {{ user() | json }}
      </div>
    </app-dashboard-layout>
  `,
})
export class DashboardPage {
  private readonly router = inject(Router);
  private readonly auth = injectAuthClient();
  readonly user = injectAuthUser();

  async logout() {
    await this.auth.signOut({
      fetchOptions: {
        onSuccess: () => {
          this.router.navigateByUrl('/', { replaceUrl: true });
        },
      },
    });
  }
}
