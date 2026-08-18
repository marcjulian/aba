import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldOff } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
  selector: 'app-forbidden',
  imports: [HlmEmptyImports, HlmButtonImports, RouterLink, NgIcon],
  providers: [provideIcons({ lucideShieldOff })],
  template: `
    <hlm-empty class="min-h-[50vh]">
      <hlm-empty-media variant="icon">
        <ng-icon name="lucideShieldOff" />
      </hlm-empty-media>
      <hlm-empty-header>
        <h1 hlmEmptyTitle>Forbidden</h1>
        <p hlmEmptyDescription>
          You don't have permission to access this page.
        </p>
      </hlm-empty-header>
      <hlm-empty-content>
        <a routerLink="/dashboard" hlmBtn variant="outline" size="sm"
          >Go to dashboard</a
        >
      </hlm-empty-content>
    </hlm-empty>
  `,
})
export class ForbiddenPage {}
