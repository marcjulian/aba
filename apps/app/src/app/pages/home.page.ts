import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseLayout } from '../layouts/base.layout';

@Component({
  selector: 'app-home-page',
  imports: [BaseLayout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-base-layout>
      <h1>Home Page</h1>
    </app-base-layout>
  `,
})
export class HomePage {}
