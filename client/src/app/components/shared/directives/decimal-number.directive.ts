import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyDecimalNumber]'
})
export class OnlyDecimalNumber {
  // Allow decimal numbers. The \. is only allowed once to occur
  private regex: RegExp = new RegExp(/-?[0-9]+(\.[0-9]*){0,1}$/g);

  @Input() OnlyDecimalNumber: boolean;
  @Input() ngModel: string;

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', '.' , 'ArrowRight' , 'ArrowLeft' , 'ArrowUp' , 'ArrowDown'];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home  and dash keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      let index = this.ngModel.indexOf('-');
      let indexOfDot = this.ngModel.indexOf('.');
      if (event.key === '-' && this.ngModel) {
        if (index >= 0) {
          event.preventDefault();
        }
        if (index === -1 && event.key === '-') {
          return;
        }
      } else if (event.key === '.' && this.ngModel) {
        if (indexOfDot >= 0) {
          event.preventDefault();
        }
        if (indexOfDot === -1 && event.key === '.') {
          return;
        }
      } else {
        return;
      }
    }

    let e = <KeyboardEvent>event;
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
