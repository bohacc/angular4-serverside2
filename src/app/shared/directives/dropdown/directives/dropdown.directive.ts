import { Directive, Input, Output, EventEmitter, ElementRef } from '@angular/core'
import { DropdownConfig } from '../'


@Directive({
  selector: '[dropdown]',
  exportAs: 'dropdown',
  host: {
    '[class.dropdown]': '!up',
    '[class.dropup]': 'up',
    '[class.open]': 'isOpen()',
    '(keyup.esc)': 'closeFromOutsideEsc()',
    '(document:click)': 'closeFromOutsideClick($event)'
  }
})
export class Dropdown {
  
  private _toggleElement: any;

  @Input() up: Boolean;
  @Input() autoClose: Boolean;
  @Input('open') private _open = false;
  @Output() openChange = new EventEmitter();

  constructor(
    public config: DropdownConfig
  ) {
    this.up = config.up;
    this.autoClose = config.autoClose;
  }

  isOpen(): Boolean {
    return this._open;
  }

  open(): void {
    if (!this._open) {
      this._open = true;
      this.openChange.emit(true);
    }
  }

  close(): void {
    if (this._open) {
      this._open = false;
      this.openChange.emit(false);
    }
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  closeFromOutsideClick($event) {
    if (this.autoClose && $event.button !== 2 && !this._isEventFromToggle($event)) {
      this.close();
    }
  }

  closeFromOutsideEsc() {
    if (this.autoClose) {
      this.close();
    }
  }

  set toggleElement(toggleElement: any) { 
    this._toggleElement = toggleElement;
  }

  private _isEventFromToggle($event) {
    return !!this._toggleElement && this._toggleElement.contains($event.target);
  }

}

@Directive({
  selector: '[dropdownToggle]',
  host: {
    'class': 'dropdown-toggle',
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'dropdown.isOpen()',
    '(click)': 'toggleOpen()'
  }
})
export class DropdownToggle {

  constructor(
    public dropdown: Dropdown, public elementRef: ElementRef
  ) {
    dropdown.toggleElement = elementRef.nativeElement;
  }

  toggleOpen() {
    this.dropdown.toggle();
  }

}
