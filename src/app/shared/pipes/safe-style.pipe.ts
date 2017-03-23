import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer }        from '@angular/platform-browser';


@Pipe({
  name: 'safeStyle'
})
export class SafeStyle implements PipeTransform {

  constructor(
    private _sanitizer: DomSanitizer
  ) {}

  transform(style) {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }

}
