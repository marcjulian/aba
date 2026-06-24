import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePanda } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { injectAuthUser } from '../auth/auth-client';

@Component({
  selector: 'app-header',
  imports: [RouterLink, HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucidePanda })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="bg-background/40 sticky top-0 z-10 flex h-(--header-height) items-center gap-2 px-4 backdrop-blur-lg"
    >
      <a routerLink="/" hlmBtn variant="ghost" size="sm">
        <ng-icon name="lucidePanda" />
        aba
      </a>

      <!-- <nav>
      </nav> -->

      <div class="ml-auto flex gap-1">
        @if (user()) {
          <a hlmBtn variant="outline" size="sm" routerLink="/dashboard">
            Dashboard
          </a>
        } @else {
          <a hlmBtn variant="outline" size="sm" routerLink="/login">Login</a>
          <a hlmBtn size="sm" routerLink="/register">Register</a>
        }
      </div>
    </header>
  `,
})
export class Header {
  readonly user = injectAuthUser();
}
