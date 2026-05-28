import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { BaseLayout } from '../layouts/base.layout';

@Component({
  selector: 'app-not-found',
  imports: [BaseLayout, HlmEmptyImports, RouterLink, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-base-layout>
      <hlm-empty class="min-h-[50vh]">
        <hlm-empty-header>
          <p class="text-muted-foreground font-bold">404</p>
          <h1 hlmEmptyTitle>Page not found</h1>
          <p hlmEmptyDescription>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </hlm-empty-header>
        <hlm-empty-content>
          <a routerLink="/" hlmBtn variant="outline" size="sm">Go back home</a>
        </hlm-empty-content>
      </hlm-empty>
    </app-base-layout>
  `,
})
export class NotFoundPage {}
