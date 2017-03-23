import {Component, Input} from '@angular/core';

@Component({
  selector: 'list3-obj',
  templateUrl: 'list3-obj.template.html'
})

export class List3Obj {
  @Input() args: any;
}
