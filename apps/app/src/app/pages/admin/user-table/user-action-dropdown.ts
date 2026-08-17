import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import type { Row } from '@tanstack/angular-table';
import type { UserWithRole } from 'better-auth/plugins';
import { injectAuthClient } from '../../../auth/auth-client';
import type { UserTableFeatures } from './user-table-features';

@Component({
  selector: 'app-user-action-dropdown',
  imports: [HlmButton, NgIcon, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsis })],
  template: `
    <button
      hlmBtn
      size="icon-xs"
      variant="ghost"
      [hlmDropdownMenuTrigger]="userActionDropDownMenu"
      align="end"
    >
      <ng-icon name="lucideEllipsis" />
    </button>

    <ng-template #userActionDropDownMenu>
      <hlm-dropdown-menu>
        <button hlmDropdownMenuItem (click)="copyUserId()">Copy user ID</button>
        @if (row().original.role !== 'admin') {
          <button hlmDropdownMenuItem (click)="impersonate()">
            Impersonate
          </button>
        }
        <!-- TODO open alert dialog -->
        <!-- <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem variant="destructive">Delete</button> -->
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class UserActionDropdown {
  private readonly authClient = injectAuthClient();
  private readonly router = inject(Router);

  readonly row = input.required<Row<UserTableFeatures, UserWithRole>>();

  async impersonate() {
    await this.authClient.admin.impersonateUser({
      userId: this.row().original.id,
    });

    await this.authClient.admin.stopImpersonating;

    await this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }

  async copyUserId() {
    await navigator.clipboard.writeText(this.row().original.id);
    toast.success('User ID copied to clipboard');
  }
}
