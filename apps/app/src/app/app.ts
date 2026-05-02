import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmButtonImports],
  template: `
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <button hlmBtn>Button</button>
    <router-outlet />
  `,
})
export class App {}
