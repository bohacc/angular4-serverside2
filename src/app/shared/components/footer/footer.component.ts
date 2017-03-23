import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder }       from '@angular/forms'

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'main-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class MainFooterComponent {

  newsletterForm: FormGroup;

  constructor(
    private _fb: FormBuilder
  ) {
    this.newsletterForm = _fb.group({

    });
  }
  
}
