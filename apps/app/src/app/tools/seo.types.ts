import { type ValueProvider, InjectionToken, inject } from '@angular/core';

export interface SeoConfig {
  title: string;
  titleTemplate: string;
  description?: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
}

const SeoConfigToken = new InjectionToken<SeoConfig>('SeoConfig');

export function provideSeo(config: SeoConfig): ValueProvider {
  return { provide: SeoConfigToken, useValue: config };
}

export function injectSeoConfig(): SeoConfig {
  return inject(SeoConfigToken);
}

/**
 * Typesafe helper for route data.
 *
 * Usage:
 *   data: { ...meta({ robots: 'noindex, follow' }) }
 */
export function meta(config: Partial<SeoConfig>): { meta: Partial<SeoConfig> } {
  return { meta: config };
}
