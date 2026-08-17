import { Component, resource } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideCircleX } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { injectAuthUser } from '../../auth/auth-client';
import { DashboardLayout } from '../../layouts/dashboard.layout';
import { injectTrpc } from '../../trpc/trpc.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardLayout, HlmCardImports, HlmBadgeImports, NgIcon],
  providers: [provideIcons({ lucideCircleCheck, lucideCircleX })],
  template: `
    <app-dashboard-layout title="Dashboard">
      <div class="grid grid-cols-1 gap-4 px-4 pt-4 md:grid-cols-2">
        <hlm-card>
          @let authUser = user();
          <hlm-card-header>
            <h2 hlmCardTitle>{{ authUser?.name }}</h2>
            <p hlmCardDescription>{{ authUser?.email }}</p>
            <span hlmBadge variant="secondary" hlmCardAction>Better Auth</span>
          </hlm-card-header>
          <div hlmCardContent>
            <div class="flex flex-wrap gap-2">
              @if (authUser?.emailVerified) {
                <span hlmBadge variant="default"
                  ><ng-icon name="lucideCircleCheck" />Verified</span
                >
              } @else {
                <span hlmBadge variant="destructive"
                  ><ng-icon name="lucideCircleX" />Unverified</span
                >
              }
              <span hlmBadge variant="outline">{{
                authUser?.role ?? 'user'
              }}</span>
            </div>
          </div>
        </hlm-card>
        <hlm-card>
          @let meUser = me.value();
          <hlm-card-header>
            <h2 hlmCardTitle>{{ meUser?.name }}</h2>
            <p hlmCardDescription>{{ meUser?.email }}</p>
            <span hlmBadge variant="secondary" hlmCardAction>tRPC</span>
          </hlm-card-header>
          <div hlmCardContent>
            <div class="flex flex-wrap gap-2">
              @if (meUser?.emailVerified) {
                <span hlmBadge variant="default"
                  ><ng-icon name="lucideCircleCheck" />Verified</span
                >
              } @else {
                <span hlmBadge variant="destructive"
                  ><ng-icon name="lucideCircleX" />Unverified</span
                >
              }
              <span hlmBadge variant="outline">{{
                meUser?.role ?? 'user'
              }}</span>
            </div>
          </div>
        </hlm-card>
      </div>
    </app-dashboard-layout>
  `,
})
export class DashboardPage {
  private readonly trpc = injectTrpc();
  readonly user = injectAuthUser();

  me = resource({ loader: () => this.trpc.client.me.query() });
}
