import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePanda } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucidePanda })],
  template: `
    <div class="grid min-h-svh lg:grid-cols-2">
      <div class="flex flex-col gap-4 p-6 md:p-10">
        <div class="flex justify-center gap-2 md:justify-start">
          <a routerLink="/" hlmBtn variant="ghost" size="sm">
            <ng-icon name="lucidePanda" />
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
          src="/login-image.webp"
          alt="Image"
          class="absolute inset-0 h-full w-full object-cover brightness-60 grayscale dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  `,
})
export class AuthLayout {}
