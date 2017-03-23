import { Component, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core'

import { MetaService, MetaDefinition }                                          from '../../shared'


@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'about',
  template: 'About component'
})
export class AboutComponent implements AfterViewInit{ 
  meta: MetaDefinition[] = [];

  constructor(
    private _meta: MetaService,
  ) {
    this.meta = [
      { name: 'description', content: 'Set by meta setter service', id: 'desc' },
      // Twitter
      { name: 'twitter:title', content: 'Set by meta setter service' },
      // Google+
      { itemprop: 'name', content: 'Set by meta setter service' },
      { itemprop: 'description', content: 'Set by meta setter service' },
      // Facebook / Open Graph
      { property: 'fb:app_id', content: 'Set by meta setter service' },
      { property: 'og:title', content: 'Set by meta setter service' }
    ];
  }

  ngAfterViewInit() {
    this._meta.setTitle('About')
    this._meta.addTags(this.meta);
  }

}
