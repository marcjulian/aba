import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCat } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideCat })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid min-h-svh lg:grid-cols-2">
      <div class="flex flex-col gap-4 p-6 md:p-10">
        <div class="flex justify-center gap-2 md:justify-start">
          <a routerLink="/" hlmBtn variant="ghost" size="sm">
            <ng-icon name="lucideCat" />
            aba
          </a>
        </div>
        <main class="flex flex-1 items-center justify-center">
          <div class="w-full max-w-xs">
            <ng-content />
          </div>
        </main>
      </div>
      <div class="bg-muted relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          class="absolute inset-0 h-full w-full object-cover brightness-60 grayscale dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  `,
})
export class AuthLayout {}
