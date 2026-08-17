import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldCheck, lucideUserRound } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import type { Row } from '@tanstack/angular-table';
import type { UserWithRole } from 'better-auth/plugins/admin';
import type { UserTableFeatures } from './user-table-features';

@Component({
  selector: 'app-user-role-badge',
  imports: [HlmBadgeImports, NgIcon],
  providers: [provideIcons({ lucideUserRound, lucideShieldCheck })],
  template: `
    <span hlmBadge variant="secondary" class="capitalize">
      @if (role() === 'admin') {
        <ng-icon name="lucideShieldCheck" />
      } @else {
        <ng-icon name="lucideUserRound" />
      }
      {{ role() ?? 'user' }}
    </span>
  `,
})
export class UserRoleBadge {
  readonly row = input.required<Row<UserTableFeatures, UserWithRole>>();

  protected role() {
    return this.row().original.role;
  }
}
