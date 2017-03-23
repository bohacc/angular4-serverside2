import {Component, Input} from '@angular/core';

@Component({
  selector: 'list4-obj',
  templateUrl: 'list4-obj.template.html'
})

export class List4Obj {
  @Input() args: any;
}
