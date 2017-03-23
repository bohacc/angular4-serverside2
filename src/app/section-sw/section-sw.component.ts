import { Component, Input } from '@angular/core';

@Component({
  selector: 'section-sw',
  templateUrl: 'section-sw.template.html',
})

export class SectionSW {
  @Input('pos')
  pos: number;
  @Input('objects')
  objects: any;

  self = this; // copy of context
  html = '';

  constructor() { }
}
