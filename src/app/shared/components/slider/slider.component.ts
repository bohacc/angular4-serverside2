import { Component, ChangeDetectionStrategy, Inject, 
         Input, ViewEncapsulation }                  from '@angular/core'

import { SliderOptions }                             from './'

import * as $ from 'jquery'
declare var Swiper: any;


@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'slider',
  styleUrls: [ './slider.component.css' ],
  templateUrl: './slider.component.html'
})
export class SliderComponent {

  @Input() public id: String;
  @Input() public slides: any[];
  @Input() public options: SliderOptions;

  slider: any;

  constructor(
    @Inject('isBrowser') private _isBrowser: Boolean
  ) {}

  initSlider(): void {

    if (this._isBrowser) {
      const sliderOptions = this.options;

      sliderOptions['pagination'] = this.options['pagination'] || `#${this.id}-swiper-pagination`;
      sliderOptions['prevButton'] = this.options['prevButton'] || `#${this.id}-swiper-button-prev`;
      sliderOptions['nextButton'] = this.options['nextButton'] || `#${this.id}-swiper-button-next`;

      this.slider = new Swiper (`#${this.id}-swiper`, sliderOptions);
    }
    
  }

}