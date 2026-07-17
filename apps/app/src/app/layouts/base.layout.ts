import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Header } from './header';

@Component({
  selector: 'app-base-layout',
  imports: [HlmButtonImports, Header],
  template: `
    <app-header />
    <main>
      <ng-content />
    </main>
    <footer></footer>
  `,
})
export class BaseLayout {}
