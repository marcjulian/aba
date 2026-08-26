import { Component, computed, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';
import { Header } from './header';

@Component({
  selector: 'app-base-layout',
  imports: [HlmButtonImports, Header],
  template: `
    <app-header />
    <main [class]="_computedMainClass()">
      <ng-content />
    </main>
    <footer></footer>
  `,
})
export class BaseLayout {
  public readonly mainClass = input<ClassValue>('');
  protected readonly _computedMainClass = computed(() =>
    hlm('', this.mainClass()),
  );
}
