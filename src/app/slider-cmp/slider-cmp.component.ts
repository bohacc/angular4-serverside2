import {Component, Input, ViewChild, EventEmitter, Output} from '@angular/core';
import {Slider} from "../slider/slider.component";

@Component({
  selector: 'slider-cmp',
  templateUrl: 'slider-cmp.template.html'
})

export class SliderCmp {
  @Input() min: number;
  @Input() max: number;
  @Input('defaultValue') defaultValue: number;
  @Input() step: number;
  @Input() postfix: string;
  @Input() round: Boolean;
  @Input() name: string;
  @Output() onChange = new EventEmitter<number>();
  @ViewChild('slider') slider: Slider;
  value: string;
  valueNumber: number;
  defaultValueTmp: number;

  constructor() {

  }

  ngOnChanges(changes) {
    if (
      (changes['defaultValue'] && changes['defaultValue'].currentValue) ||
      this.defaultValue && (changes['max'] && changes['max'].currentValue)
    ) {
      this.setProps(this.defaultValue);
    }
  }

  ngOnInit() {

  }

  plus() {
    let sliderCurrentValue = this.getRoundValue() + this.step;
    if(sliderCurrentValue <= this.max) {
      this.setProps(sliderCurrentValue);
    }
  }

  minus() {
    let sliderCurrentValue = this.getRoundValue() - this.step;
    if(sliderCurrentValue >= this.min){
      this.setProps(sliderCurrentValue);
    }
  }

  setProps(val: number) {
    this.valueNumber = val;
    this.value = this.getRoundValue().toString().replace(/\./g, ',') + this.postfix;
    this.defaultValueTmp = this.valueNumber;
    this.onChange.emit(val);
  }

  getRoundValue(): number {
    return (this.round ? parseFloat(this.valueNumber.toFixed(2)) : this.valueNumber);
  }

  onChangeValue(event: number) {
    this.setProps(event);
  }
}
