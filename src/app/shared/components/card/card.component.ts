import { Component, ChangeDetectionStrategy, Input, ViewEncapsulation } from '@angular/core'


@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() public data: any;
  @Input() public type: String;

  constructor() {}

}