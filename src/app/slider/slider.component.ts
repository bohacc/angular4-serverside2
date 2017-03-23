import {Component, ElementRef, Directive, Input, EventEmitter, Output, Inject} from '@angular/core';
//import { isBrowser } from 'angular2-universal';

declare var $: any;

@Directive({
  selector: '[slider]',
  exportAs: 'sliderDirective'
})

export class Slider {
  @Input() min: number;
  @Input() max: number;
  @Input() defaultValue: number;
  @Input() step: number;
  @Input() postfix: string;
  @Input() round: Boolean;
  @Output() onChangeValue = new EventEmitter<number>();
  options: any;

  constructor(private _elRef: ElementRef, @Inject('isBrowser') private isBrowser: Boolean) {
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes) {
    if (
      (changes['defaultValue'] && changes['defaultValue'].currentValue) ||
      (this.defaultValue && (changes['max'] && changes['max'].currentValue))
    ) {
      this.init();
    }
  }

  init() {
    if (this.isBrowser) {
      $(require('../../../tools/js/jquery/jquery-ui.min'));
      let _this = this;
      let options = {
        ranger: $(this._elRef.nativeElement).find('.slider_lenght'),
        input: $(this._elRef.nativeElement).find(".amount_lenght"),
        min: this.min,
        max: this.max,
        defaultValue: this.defaultValue,
        step: this.step,
        postfix: this.postfix,
        round: this.round
      };

      options.ranger.slider({
        value: options.defaultValue,
        min: options.min,
        max: options.max,
        step: options.step,
        slide: function(event, ui) {
          _this.onChangeValue.emit(ui.value);
          // PUT CURRENT VALUT FROM SLIDER INTO INPUT
          options.input.val(ui.value.toString().replace(/\./g, ',') + options.postfix);
        },
        round: options.round
      });
    }
  }

  minus() {
  }

  plus() {
  }
}
