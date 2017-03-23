import { Component, Input } from '@angular/core';

@Component({
  selector: 'list4-item',
  templateUrl: 'list4-item.template.html',
})
export class List4Item {
  @Input('item') item: any;

  constructor() {}
}
