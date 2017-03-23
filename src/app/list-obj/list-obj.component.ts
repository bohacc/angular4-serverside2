import {Component, Input} from '@angular/core';

@Component({
  selector: 'list-obj',
  templateUrl: 'list-obj.template.html'
})

export class ListObj {
  @Input() args: any;
  constructor() {}
}
