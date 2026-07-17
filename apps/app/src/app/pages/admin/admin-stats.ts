import { Component, resource } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideTrendingDown,
  lucideTrendingUp,
  lucideUserPlus,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { injectTrpc } from '../../trpc/trpc.service';

export interface AdminStatsData {
  totalUsers: number;
  newUsersLast7Days: number;
  newUsersTrend: number;
}

@Component({
  selector: 'app-admin-stats',
  imports: [HlmCardImports, HlmBadgeImports, NgIcon],
  providers: [
    provideIcons({
      lucideUsers,
      lucideUserPlus,
      lucideTrendingUp,
      lucideTrendingDown,
    }),
  ],
  template: `
    @if (stats.value(); as s) {
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <hlm-card>
          <hlm-card-header>
            <p hlmCardDescription>
              <ng-icon name="lucideUserPlus" />
              New Users
            </p>
            <p
              hlmCardTitle
              class="text-2xl font-semibold tabular-nums md:text-3xl"
            >
              {{ s.newUsersLast7Days }}
            </p>
            <p hlmCardDescription>Since last week</p>
            <div hlmCardAction>
              @let trend = s.newUsersTrend;
              <span hlmBadge [variant]="trend >= 0 ? 'default' : 'destructive'">
                <ng-icon
                  [name]="
                    trend >= 0 ? 'lucideTrendingUp' : 'lucideTrendingDown'
                  "
                />
                {{ trend }}%
              </span>
            </div>
          </hlm-card-header>
        </hlm-card>
        <hlm-card>
          <hlm-card-header>
            <p hlmCardDescription>
              <ng-icon name="lucideUsers" />
              Total Users
            </p>
            <p
              hlmCardTitle
              class="text-2xl font-semibold tabular-nums md:text-3xl"
            >
              {{ s.totalUsers }}
            </p>
            <div hlmCardAction></div>
          </hlm-card-header>
        </hlm-card>
      </div>
    }
  `,
})
export class AdminStats {
  private readonly trpc = injectTrpc();
  readonly stats = resource({
    loader: () => this.trpc.client.admin.stats.query(),
  });
}
