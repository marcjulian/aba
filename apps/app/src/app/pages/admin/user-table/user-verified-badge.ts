import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideCircleX } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import type { Row } from '@tanstack/angular-table';
import type { UserWithRole } from 'better-auth/plugins/admin';
import type { UserTableFeatures } from './user-table-features';

@Component({
  selector: 'app-user-verified-badge',
  imports: [HlmBadgeImports, NgIcon],
  providers: [provideIcons({ lucideCircleCheck, lucideCircleX })],
  template: `
    @if (row().original.emailVerified) {
      <span hlmBadge variant="default">
        <ng-icon name="lucideCircleCheck" />Verified
      </span>
    } @else {
      <span hlmBadge variant="destructive">
        <ng-icon name="lucideCircleX" />Unverified
      </span>
    }
  `,
})
export class UserVerifiedBadge {
  readonly row = input.required<Row<UserTableFeatures, UserWithRole>>();
}
