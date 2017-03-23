import { Component, Input } from '@angular/core';

@Component({
  selector: 'list3-item',
  templateUrl: 'list3-item.template.html',
})

export class List3Item {
  @Input('item') item: any;

  constructor() {}
}
