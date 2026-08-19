import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucideEllipsis,
  lucideTrash2,
  lucideUserCog,
} from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { QueryClient } from '@tanstack/angular-query-experimental';
import type { Row } from '@tanstack/angular-table';
import type { UserWithRole } from 'better-auth/plugins';
import { injectAuthClient, injectAuthUser } from '../../../auth/auth-client';
import type { UserTableFeatures } from './user-table-features';

@Component({
  selector: 'app-user-action-dropdown',
  imports: [HlmButton, NgIcon, HlmDropdownMenuImports, HlmAlertDialogImports],
  providers: [
    provideIcons({
      lucideCopy,
      lucideEllipsis,
      lucideTrash2,
      lucideUserCog,
    }),
  ],
  template: `
    <button
      hlmBtn
      size="icon-xs"
      variant="ghost"
      [hlmDropdownMenuTrigger]="userActionDropDownMenu"
      align="end"
    >
      <span class="sr-only">User actions</span>
      <ng-icon name="lucideEllipsis" />
    </button>

    <ng-template #userActionDropDownMenu>
      <hlm-dropdown-menu>
        <button hlmDropdownMenuItem (click)="copyUserId()">
          <ng-icon name="lucideCopy" />
          Copy user ID
        </button>
        @if (row().original.role !== 'admin') {
          <button hlmDropdownMenuItem (click)="impersonate()">
            <ng-icon name="lucideUserCog" />
            Impersonate
          </button>
        }

        @if (!isMe()) {
          <hlm-dropdown-menu-separator />

          <button
            hlmDropdownMenuItem
            variant="destructive"
            [hlmAlertDialogTriggerFor]="deleteDialog"
          >
            <ng-icon name="lucideTrash2" />
            Delete
          </button>
        }
      </hlm-dropdown-menu>
    </ng-template>

    <hlm-alert-dialog #deleteDialog="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>Delete user {{ row().original.name }}?</h2>
          <p hlmAlertDialogDescription>
            Are you sure you want to permanently delete the user &ldquo;{{
              row().original.name
            }}&rdquo;? This action cannot be undone.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancel</button>
          <button
            hlmAlertDialogAction
            variant="destructive"
            (click)="deleteUser(); ctx.close()"
          >
            Delete
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class UserActionDropdown {
  private readonly authClient = injectAuthClient();
  private readonly authUser = injectAuthUser();
  private readonly router = inject(Router);
  private readonly queryClient = inject(QueryClient);

  readonly row = input.required<Row<UserTableFeatures, UserWithRole>>();

  protected readonly isMe = computed(
    () => this.row().original.id === this.authUser()?.id,
  );

  async impersonate() {
    await this.authClient.admin.impersonateUser({
      userId: this.row().original.id,
    });

    await this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }

  async copyUserId() {
    await navigator.clipboard.writeText(this.row().original.id);
    toast.success('User ID copied to clipboard');
  }

  async deleteUser() {
    await this.authClient.admin.removeUser({ userId: this.row().original.id });

    await this.queryClient.invalidateQueries({ queryKey: ['users'] });
  }
}
