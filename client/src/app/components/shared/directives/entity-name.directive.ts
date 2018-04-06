import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyEntityName]'
})
export class OnlyEntityName {
  regexStr = "^([a-zA-Z0-9 ]+)$";

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home' , 'ArrowRight' , 'ArrowLeft' , 'ArrowUp' , 'ArrowDown' , '&' , '-' , '.'];

  constructor(private el: ElementRef) { }

  @Input() OnlyEntityName: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let e = <KeyboardEvent>event;
    let ch = (e.key);
    let regEx = new RegExp(this.regexStr);
    if (regEx.test(ch)) {
      return;
    } else {
      e.preventDefault();
    }
  }
}
