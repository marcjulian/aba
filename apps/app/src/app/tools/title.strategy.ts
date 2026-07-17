import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Seo } from './seo';
import { injectSeoConfig } from './seo.types';
import type { SeoConfig } from './seo.types';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly seo = inject(Seo);
  private readonly config = injectSeoConfig();

  updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    const fullTitle = pageTitle
      ? this.config.titleTemplate.replace('%s', pageTitle)
      : this.config.title;
    this.title.setTitle(fullTitle);

    this.seo.setCanonical(snapshot.url);

    const mergedSeo = this.collectSeoConfig(snapshot);
    this.seo.applyFromStrategy(mergedSeo, fullTitle);
  }

  /** Walk the activated route chain, merging parent→child data.meta (child wins). */
  private collectSeoConfig(snapshot: RouterStateSnapshot): SeoConfig {
    let config: SeoConfig = { ...this.config };
    let route = snapshot.root;
    while (route) {
      const routeMeta = route.data['meta'] as Partial<SeoConfig> | undefined;
      if (routeMeta) {
        config = { ...config, ...routeMeta };
      }
      route = route.firstChild!;
    }
    return config;
  }
}

export const provideTitleStrategy = () => ({
  provide: TitleStrategy,
  useClass: AppTitleStrategy,
});
