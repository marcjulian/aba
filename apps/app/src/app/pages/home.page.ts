import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseLayout } from '../layouts/base.layout';

@Component({
  selector: 'app-home-page',
  imports: [BaseLayout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-base-layout>
      <div class="mx-auto max-w-(--breakpoint-lg) px-4">
        <h1>Home Page</h1>
        <p>
          SSR rendered at:
          @if (timeResource.isLoading()) {
            loading...
          } @else if (timeResource.hasValue()) {
            <strong>{{ timeResource.value().timestamp }}</strong>
          }
        </p>
      </div>
    </app-base-layout>
  `,
})
export class HomePage {
  timeResource = httpResource<{ status: string; timestamp: string }>(
    () => `${environment.apiUrl}/api/health`,
  );
}
