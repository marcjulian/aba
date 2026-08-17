import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUserCog } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  injectAuthClient,
  injectAuthUser,
  injectIsImpersonating,
} from '../auth/auth-client';

@Component({
  selector: 'app-impersonation-banner',
  imports: [HlmButton, NgIcon],
  providers: [provideIcons({ lucideUserCog })],
  template: `
    @if (isImpersonating()) {
      <div class="h-12 px-2">
        <div
          class="flex h-full items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-100 px-2 dark:border-amber-800 dark:bg-amber-900"
        >
          <div
            class="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-100"
          >
            <ng-icon name="lucideUserCog" class="font-medium" />
            <span>
              You are impersonating
              <span class="font-medium">
                {{ user()?.name || user()?.email }}
              </span>
            </span>
          </div>
          <button
            hlmBtn
            size="sm"
            variant="outline"
            (click)="stopImpersonating()"
          >
            Stop impersonating
          </button>
        </div>
      </div>
    }
  `,
})
export class ImpersonationBanner {
  private readonly authClient = injectAuthClient();
  private readonly router = inject(Router);

  protected readonly isImpersonating = injectIsImpersonating();
  protected readonly user = injectAuthUser();

  async stopImpersonating() {
    await this.authClient.admin.stopImpersonating();
    await this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }
}
